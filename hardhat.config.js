require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: { 
  	version: "0.8.17", 
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
  	goerli: {
  		url: process.env.REACT_APP_URL,
  		accounts: [ process.env.REACT_APP_ACCOUNT ]
  	} 
  },
  etherscan: {
    apiKey: {
      goerli: process.env.REACT_APP_ETHERSCAN
    }
  }  
};
