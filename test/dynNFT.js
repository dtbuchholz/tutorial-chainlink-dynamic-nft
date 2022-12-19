const { expect } = require("chai");
const { ethers, upgrades, network } = require("hardhat");
const { TablelandTables } = require("@tableland/evm");

// Deploy the TablelandTables registry contract to allow for tables to be minted
before(async function () {
  const TablelandTablesFactory = await ethers.getContractFactory(
    "TablelandTables"
  );
  await (
    await upgrades.deployProxy(TablelandTablesFactory, ["https://foo.xyz/"], {
      kind: "uups",
    })
  ).deployed();
});

describe("dynNFT", function () {
  // An example test to check that an NFT was succesfully minted with the correct default metadata
  it("Should return the token URI for minted token", async function () {
    // Deploy the dynNFT contract
    const baseURI = "http://localhost:8080/query?extract=true&unwrap=true&s=";
    const dNFT = await ethers.getContractFactory("dynNFT");
    const dnft = await dNFT.deploy(baseURI);
    await dnft.deployed();
    // Initialized the two tables
    let tx = await dnft.initTables();
    let receipt = await tx.wait();
    let events = receipt.events ?? [];
    // Get both TablelandTables transfer events ("flowers" is minted before "tokens")
    const transfers = events.filter((v) => v.event === "Transfer");
    const tableIdFlowers = transfers[0].args?.tokenId;
    const tableIdTokens = transfers[1].args?.tokenId;
    const flowersTable = `flowers_${network.config.chainId}_${tableIdFlowers}`;
    const tokensTable = `tokens_${network.config.chainId}_${tableIdTokens}`;
    // Mint a token to `minter`
    const [minter] = await ethers.getSigners();
    tx = await dnft.connect(minter).mint(minter.address);
    receipt = await tx.wait();
    const [event] = receipt.events ?? [];
    const tokenId = event.args?.tokenId;
    // URI encode the SQL query
    const query = encodeURIComponent(
      `select json_object('name','Friendship Seed #'||${tokensTable}.id,'image','ipfs://'||cid||'/'||stage||'.jpg','attributes',json_array(json_object('display_type','string','trait_type','Flower Stage','value',stage),json_object('display_type','string','trait_type','Flower Color','value',color))) from ${tokensTable} join ${flowersTable} on ${tokensTable}.stage_id = ${flowersTable}.id where ${tokensTable}.id=${tokenId} group by ${tokensTable}.id`
    );
    // Check the `tokenURI` is correct for the minted token
    expect(await dnft.tokenURI(tokenId)).to.equal(`${baseURI}${query}`);
  });
});
