const dotenv = require("dotenv");
const { extendEnvironment } = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
require("hardhat-dependency-compiler");
require("@openzeppelin/hardhat-upgrades");
dotenv.config();

module.exports = {
  solidity: "0.8.17",
  dependencyCompiler: {
    paths: [
      // For testing purposes
      "@tableland/evm/contracts/TablelandTables.sol",
    ],
  },
  networks: {
    // testnets
    "ethereum-goerli": {
      url: `https://eth-goerli.g.alchemy.com/v2/${
        process.env.ETHEREUM_GOERLI_API_KEY ?? ""
      }`,
      accounts:
        process.env.ETHEREUM_GOERLI_PRIVATE_KEY !== undefined
          ? [process.env.ETHEREUM_GOERLI_PRIVATE_KEY]
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
    // devnets
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
    tablelandHost: {
      localhost:
        "http://localhost:8080/api/v1/query?extract=true&unwrap=true&statement=",
      testnets:
        "https://testnets.tableland.network/api/v1/query?extract=true&unwrap=true&statement=",
      mainnet:
        "https://tableland.network/api/v1/query?extract=true&unwrap=true&statement=",
    },
    contractAddress: "0x86AA63f233a41a4af09E28f5953f4Aa627978e31", // Replace with deployed contract address
  },
};

extendEnvironment((hre) => {
  // Get configs for user-selected network
  const config = hre.userConfig.config;
  hre.tablelandHost = config.tablelandHost;
  hre.contractAddress = config.contractAddress;
});
