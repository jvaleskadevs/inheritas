# Inheritas Project

Inherit assets in a decentralized way. Inheritas is a service to make assets inheritance easy, safe, fast, cheap and decentralized.

## About Inheritas

The Inheritas Service was developed by J.Valeska as a Final Project in the Web3 Degree at Alchemy University. Class 2022-2023. 

This project is under continous development. The current version is almost ready for 
production but some small changes and improvements would be needed.

## Live Project

https://inheritas3.web.app

## Project Setup

### Contracts

- Create a `.env` file in the root directory. Add the following environment variables:

```
REACT_APP_URL=<YOUR_ALCHEMY_URL>
REACT_APP_API=<YOUR_ALCHEMY_API_KEY>
REACT_APP_ACCOUNT=<YOUR_WALLET_PRIVATE_KEY>
REACT_APP_ETHERSCAN=<YOUR_ETHERSCAN_API_KEY>
```

- Then, install dependencies:

```shell
npm install
```

- Deploy the contract:

```
npx hardhat run scripts/deploy.js
```

- Test the contract:

```shell
npx hardhat test
```

### dApp

- Create a `.env` file in the app directory:

```
cd app && touch .env
```

- Add the following environment variable:

```
REACT_APP_API=<YOUR_ALCHEMY_API_KEY>
```

- Install dependencies inside the app root folder and run the dApp:

```shell
npm install
npm start
```

## Tech Stack

- Alchemy SDK & API
- Goerli network, Goerli etherscan
- OpenZeppelin
- ERC721, ERC1155
- IPFS
- React
- Hardhat
- Ethers
- Chai
- MetaMask
- Dotenv
- Tailwind
- Firebase
- Github
- Gedit
- Blender, Kdenlive, FlexClip and SvgRepo

Big thanks to everyone on their teams and to everyone who supports Open Source and free tools. PLW3!

## Knowledge Stack

- Develop, deploy and verify smart contracts to the Ethereum Goerli testnet network
- Test smart contracts in a local blockchain environment
- Develop and deploy a dApp to interact with smart contracts (read/write)
- Fetch NFTs using the Alchemy SDK
- Implement the ERC721 and ERC1155 standards and their interfaces
- Upload files to the IPFS and access them from the smart contracts
- Connect MetaMask to a custom Alchemy RPC node.
- Use dotenv library to manage secrets
- Smart Contract security
- Style a dApp

- Create a full-stack dApp to solve an existing problem
- Create a brand around the dApp
- Create a potential business around the dApp
- Create a video presentation about the dApp
- Create a Github repo with the dApp code

Big thanks to everyone on the Alchemy team and to everyone who supports free educational material. PLW3!

## Potential TODOs

- Make the UI fully responsive and add a margin top to the footer. (MUST DO)
- ERC20 support
- Future standards support
- Multi-wallet support
- Wallet connection events support
- Multi-chain support
- Move the web3 logic from App.js to a custom context
- Implement batch register, batch alive and batch claim.
- Implement history section
- Implement a way to notify beneficiaries and/or a beneficiaries UI
- Implement a way to send the assetID to a beneficiary
- Implement a way to calc the assetID to help beneficiaries whose forgot it
- Implement Remove function in the dApp - (currently works only from the contract)
- Improve the app flow and make it more descriptive adding tooltips.
- Improve security
- Add functionality to the search bar (The component is there but it does not work) 
- Improve texts, images, icons and guides
- Dark/light theme
- Make the LifeTimePass an NFT
- Create a NFT collection and share a percentage of the profits with NFT holders
- Anything proposed by you
- ....


## Contribute and Contact

Feel free to reach me with any proposal or commentary in the Alchemy University Discord. Tag me:  @J.Valeska / @MaestroCripto

## Invest on my web3 career

Feel free to send some ETH to my Ethereum mainnet wallet: 
```
0xf8d4DEda6726134d5F1B506dc7bD6c407cFF64dF
```
Donators and investors could be rewarded in my next projects. Thanks! PLW3!

