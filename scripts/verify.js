// Standard `ethers` import for blockchain operations, plus `network` for logging the flagged network
const { contractAddress } = require("hardhat");
require("@nomiclabs/hardhat-etherscan");

async function main() {
  await run("verify:verify", {
    address: contractAddress,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
