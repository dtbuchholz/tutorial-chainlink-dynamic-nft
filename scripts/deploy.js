const { ethers } = require("hardhat");

async function main() {
  const [account] = await ethers.getSigners();
  // We get the contract to deploy
  const DynNFT = await ethers.getContractFactory("DynNFT");
  // Note the base URI has `extract=true`, `unwrap=true`, and `s` (for the SQL)
  // These are needed for creating ERC-721 compliant metadata
  // The end result will look something like `https://testnets.tableland.network/api/v1/query?extract=true&unwrap=true&statement=`

  // Deploy the NFT—note the Tableland gateway base URI is defined automatically
  // by the contract for the respective network
  const dynNFT = await DynNFT.deploy();
  await dynNFT.deployed();
  // Log the address and save this for verification purposes
  console.log("DynNFT deployed to:", dynNFT.address);

  // Initialize the Tableland tables
  let tx = await dynNFT.initTables();
  let receipt = await tx.wait();

  // For demonstration purposes, mint an NFT and log its token URI
  tx = await dynNFT.mint(account.address);
  receipt = await tx.wait();
  const [event] = receipt.events ?? [];
  const tokenId = event.args?.tokenId;
  const tokenUri = await dynNFT.tokenURI(tokenId);
  console.log(tokenUri);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
