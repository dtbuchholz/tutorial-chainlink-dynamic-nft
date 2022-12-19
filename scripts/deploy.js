const { ethers, network, tablelandHost } = require("hardhat");

async function main() {
  const [account] = await ethers.getSigners();
  // We get the contract to deploy
  const DynNFT = await hre.ethers.getContractFactory("dynNFT");
  // Tableland gateway -- we'll only need `localhost` or `testnet` gateways, but a `mainnet` option is in the config
  let baseURIString =
    network.name === "localhost"
      ? tablelandHost.localhost
      : tablelandHost.testnet;
  // Note the base URI has `extract=true`, `unwrap=true`, and `s` (for the SQL)
  // These are needed for creating ERC-721 compliant metadata
  // The end result will look something like `https://testnets.tableland.network/query?extract=true&unwrap=true&s=`

  // Deploy the NFT with the base URI defined
  const dynNFT = await DynNFT.deploy(baseURIString);
  await dynNFT.deployed();
  // Log the address and save this for verification purposes
  console.log("dynNFT deployed to:", dynNFT.address);

  // Initialize the Tableland tables
  let tx = await dynNFT.initTables();
  let receipt = await tx.wait();

  // For demonstration purposes, mint an NFT and log its token URI
  tx = await dynNFT.mint(account.address);
  receipt = await tx.wait();
  let [event] = receipt.events ?? [];
  let tokenId = event.args?.tokenId;
  let tokenUri = await dynNFT.tokenURI(tokenId);
  console.log(tokenUri);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
