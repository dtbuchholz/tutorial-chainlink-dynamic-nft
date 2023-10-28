const dotenv = require("dotenv");
const { extendEnvironment } = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
require("hardhat-dependency-compiler");
require("@openzeppelin/hardhat-upgrades");
require("@tableland/hardhat");
dotenv.config();

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  dependencyCompiler: {
    paths: [
      // For testing purposes
      "@tableland/evm/contracts/TablelandTables.sol",
    ],
  },
  localTableland: {
    silent: false,
    verbose: false,
  },
  networks: {
    // testnets
    "ethereum-sepolia": {
      url: `https://eth-sepolia.g.alchemy.com/v2/${
        process.env.ETHEREUM_SEPOLIA_API_KEY ?? ""
      }`,
      accounts:
        process.env.ETHEREUM_SEPOLIA_PRIVATE_KEY !== undefined
          ? [process.env.ETHEREUM_SEPOLIA_PRIVATE_KEY]
          : [],
    },
    "polygon-mumbai": {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${
        process.env.POLYGON_MUMBAI_API_KEY ?? ""
      }`,
      accounts:
        process.env.POLYGON_MUMBAI_PRIVATE_KEY !== undefined
          ? [process.env.POLYGON_MUMBAI_PRIVATE_KEY]
          : [],
    },
    hardhat: {
      mining: {
        auto: !(process.env.HARDHAT_DISABLE_AUTO_MINING === "true"),
        interval: [100, 3000],
      },
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
    },
    customChains: [],
  },
  config: {
    contractAddress: "0x86AA63f233a41a4af09E28f5953f4Aa627978e31", // Replace with deployed contract address
  },
};

extendEnvironment((hre) => {
  // Get configs for user-selected network
  const config = hre.userConfig.config;
  hre.tablelandHost = config.tablelandHost;
  hre.contractAddress = config.contractAddress;
});
