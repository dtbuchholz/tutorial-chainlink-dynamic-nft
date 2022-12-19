# Dynamic NFT with Chainlink Automation

Tableland + [Chainlink Automation](https://docs.chain.link/chainlink-automation/introduction/) to create dynamic NFTs.

# Background

## Overview

This tutorial reproduces the Chainlink [dNFT tutorial](https://docs.chain.link/chainlink-automation/util-overview#dynamic-nfts), but instead of static `tokenURI` switching, it uses Tableland and mutable tables to dynamically change the metadata. At specific intervals, the Chainlink network makes on-chain calls that mutate the current state of the NFT's metadata. What's unique from the original example is the usage writing to / reading from Tableland tables.

Instead of solely using IPFS to store all of the metadata, pointers to IPFS (CIDs) and filepaths are stored in tables. The outdated decentralizd approach toward dNFTs (switching the `tokenURI` to a new IPFS metadata file) is replaced with storing only a subset of that oringal data in tables, and metadata mutations happen using on-chain actions. The example keeps things simple, but further extensions could allow for extending the metadata options (e.g., new colors, images, etc.) without changing the `tokenURI` / `baseURI` (i.e., no need to update storage references).

In regards to Chainlink, [Upkeep](https://docs.chain.link/chainlink-automation/manage-upkeeps/) is used to register the `dynNFT` contract; the funding is done through transferring LINK to the contract (i.e., not in the Upkeep UI). At a defined `interval`, the Chainlink network will call `checkUpkeep`, and if certain conditions are met, it will mutate the NFT by calling `performUpkeep`, which changes the Tableland table values.

This tutorial deploys on the Polygon Mumbai testnet and uses Alchemy. As such, be sure to sign up for an Alchemy account and (optionally) a Polygonscan account. These are further explained below.

For a full walkthrough, see the following documentation: [here](https://docs.tableland.xyz/dynamic-nft-with-chainlink-automation)

## Project Structure

There exists the `dynNFT.sol` contract, which inherits from the Chainlink [`AutomationCompatible`](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/AutomationCompatible.sol) contract, as well as some other useful ones. There exists a `deploy.js` script (for deploying the NFT to a testnet) and a `verify.js` script to then verify the source code.

To make this possible, a `.env` file should be created, with values `POLYGON_MUMBAI_PRIVATE_KEY`, `POLYGON_MUMBAI_API_KEY`, and `POLYGONSCAN_API_KEY`. This includes an EVM account private key, an Alchmey API key for Polygon Mumbai (for deploying to testnet), and a Polygonscan API key (for verification). There's also a `test/dynNFT.js` script for a simple testing example. Lastly, some configuration is done in `hardhat.config.js` to make it easier to develop.

```markdown
.
├── contracts
│   └── dynNFT.sol
├── hardhat.config.js
├── package-lock.json
├── package.json
├── scripts
│   ├── deploy.js
│   └── verify.js
├── .env
└── test
└── dynNFT.js
```

## Usage

Locally develop using `local-tableland` by running the following in separate terminal windows. First, Spin up a local instance of Tableland (as well as a hardhat local node) and then deploy the contract locally:

```
npx local-tableland
npx hardhat run scripts/deploy.js --network localhost
```

Deploy the contract to Polygon Mumbai:

```
npx hardhat run scripts/deploy.js --network polygon-mumbai
```

Verify the contract to Polygon Mumbai, after saving its value in `hardhat.config.js`'s `contractAddress`:

```
npx hardhat run scripts/verify.js --network polygon-mumbai
```

Run the tests in the `test` directory:

```
npx hardhat text
```

If you'd like to use additional testnets or mainnets, simply update the `hardhat.config.js` and `.env` files accordingly.

# Output

- Source Code: [here](https://gist.github.com/dtbuchholz/c2c35b595dabddf04374d2edd97b601a)
- Deployed contract: [here](https://mumbai.polygonscan.com/token/0x86aa63f233a41a4af09e28f5953f4aa627978e31)
- Dynamic NFT collection: [here](https://testnets.opensea.io/collection/tableland-chainlink-dnft)
  - The “seed” NFT will grow into a “bloom” — all of these mutations are handled by on-chain table writes that are updated by the Chainlink network (example images [here](https://docs.tableland.xyz/dynamic-nft-with-chainlink-automation#dfbde22b303a41e597cc36eaacb7473d) as well as at the collection noted)
