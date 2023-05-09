// Standard `ethers` import for blockchain operations, plus `network` for logging the flagged network
const { ethers, network, tablelandHost, contractAddress } = require("hardhat");
require("@nomiclabs/hardhat-etherscan");

async function main() {
  await run("verify:verify", {
    address: contractAddress,
    constructorArguments: [tablelandHost.testnets],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
