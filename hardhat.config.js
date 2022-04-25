/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require("@nomiclabs/hardhat-waffle");
 module.exports = {
   solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ]
   },
   defaultNetwork: "hardhat",
   networks: {
     hardhat: {
       // // If you want to do some forking, uncomment this
       // forking: {
       //   url: MAINNET_RPC_URL
       // }
   },
   localhost: {
   },
   },
 };
 