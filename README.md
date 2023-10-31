# Dynamic NFT with Chainlink Automation

Tableland + [Chainlink Automation](https://docs.chain.link/chainlink-automation/introduction/) to create dynamic NFTs.

## Background

### Overview

This tutorial reproduces the Chainlink [dNFT tutorial](https://docs.chain.link/chainlink-automation/util-overview#dynamic-nfts), but instead of static `tokenURI` switching, it uses Tableland and mutable tables to dynamically change the metadata. At specific intervals, the Chainlink network makes onchain calls that mutate the current state of the NFT's metadata. What's unique from the original example is the usage writing to / reading from Tableland tables.

Instead of solely using IPFS to store all of the metadata, pointers to IPFS (CIDs) and filepaths are stored in tables. The outdated decentralized approach toward dNFTs (switching the `tokenURI` to a new IPFS metadata file) is replaced with storing only a subset of that original data in tables, and metadata mutations happen using onchain actions. The example keeps things simple, but further extensions could allow for extending the metadata options (e.g., new colors, images, etc.) without changing the `tokenURI` / `baseURI` (i.e., no need to update storage references).

In regards to Chainlink, [Upkeep](https://docs.chain.link/chainlink-automation/manage-upkeeps/) is used to register the `DynNFT` contract; the funding is done through transferring LINK to the contract (i.e., not in the Upkeep UI). At a defined `interval`, the Chainlink network will call `checkUpkeep`, and if certain conditions are met, it will mutate the NFT by calling `performUpkeep`, which changes the Tableland table values.

This tutorial deploys on the Polygon Mumbai testnet and uses Alchemy. As such, be sure to sign up for an Alchemy account and (optionally) a Polygonscan account. These are further explained below.

For a full walkthrough, see the following documentation: [here](https://docs.tableland.xyz/tutorials/dynamic-nft-chainlink)

### Project structure

There exists the `DynNFT.sol` contract, which inherits from the Chainlink [`AutomationCompatible`](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/AutomationCompatible.sol) contract, as well as some other useful ones. There exists a `deploy.js` script (for deploying the NFT to a testnet) and a `verify.js` script to then verify the source code.

To make this possible, a `.env` file should be created, with values `POLYGON_MUMBAI_PRIVATE_KEY`, `POLYGON_MUMBAI_API_KEY`, and `POLYGONSCAN_API_KEY` (or similar if you're using other chains). This includes an EVM account private key, an Alchemy API key for Polygon Mumbai (for deploying to testnet), and a Polygonscan API key (for verification). There's also a `test/DynNFT.js` script for a simple testing example. Lastly, some configuration is done in `hardhat.config.js` to make it easier to develop.

<!--prettier ignore-->

```markdown
.
├── contracts
│   └── DynNFT.sol
├── hardhat.config.js
├── package-lock.json
├── package.json
├── scripts
│   ├── deploy.js
│   └── verify.js
├── .env
└── test
└── DynNFT.js
```

## Usage

First, clone this repo:

```sh
git clone https://github.com/dtbuchholz/tutorial-chainlink-dynamic-nft
```

### Build & deploy

To simply compile contracts, you can install dependencies with `npm install` and then run:

```
npm run build
```

To install packages, compile contracts, and also startup Local Tableland and Hardhat nodes, run the following:

```
npm run up
```

This will keep the nodes running until you exit the session. While this is running, you can then choose to deploy the contracts to these local networks by opening a new terminal window and running:

```
npm run deploy:up
```

Alternatively, you may want to deploy contracts locally but without active nodes running. The following can be used to deploy the contracts while also starting & shutting down Local Tableland and Hardhat nodes once the script exits. Be sure anything running via `npm run up` has been closed out before running:

```
npm run deploy:local
```

Lastly, to deploy to any live network listed in `hardhat.config.js`, you can simply pass the network name after running the `deploy` command. The `.env.example` file should first be copied to a `.env` file and then have all of the values for private keys and API keys replaced. For example, to deploy contracts on Polygon Mumbai, you would do the following after creating a `.env` file with variables for `POLYGON_MUMBAI_PRIVATE_KEY`, `POLYGON_MUMBAI_API_KEY`, and (optionally) `POLYGONSCAN_API_KEY`:

```
npm run deploy polygon-mumbai
```

Note that if no network name is passed, the script will fail.

Lastly, verify the contract on the network (e.g., Polygon Mumbai), after saving its value in `hardhat.config.js`'s `contractAddress`, run:

```
npm run verify polygon-mumbai
```

### Testing

For full test coverage, run the following, which will show statement, branch, function, and line coverage (see `index.html` located in the `coverage` directory):

```
npm test
```

You can see gas costs associated with each contract method:

```
npm run test:gas
```

### Formatting & cleanup

Remove untracked files and directories, such as those that were autogenerated:

```
npm run clean
```

Format and lint the project:

```
npm run format
```

### Output

- Deployed contract: [here](https://mumbai.polygonscan.com/token/0xD91f9cDdBF68Ad1bF97aCC9bA83ea115bF506232)
- Dynamic NFT collection: [here](https://testnets.opensea.io/collection/tableland-chainlink-dnft)
  - The "seed" NFT will grow into a "bloom" — all of these mutations are handled by onchain table writes that are updated by the Chainlink network (example images [here](https://docs.tableland.xyz/tutorials/dynamic-nft-chainlink#end-result) as well as at the collection noted).
