const { ethers } = require("hardhat");

async function main() {
  accounts = await ethers.getSigners();
  owner = await accounts[0];

  getFactory = await ethers.getContractFactory("@uniswap/v2-core/contracts/UniswapV2Factory.sol:UniswapV2Factory");
  getRouter = await ethers.getContractFactory("UniswapV2Router02");
  getWETH = await ethers.getContractFactory("WETH9");

  Weth = await getWETH.deploy();
  factory = await getFactory.deploy(owner.address);
  console.log(factory.address, Weth.address);
  router = await getRouter.deploy(factory.address, Weth.address);
  console.log(router.address);  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
//npx hardhat run --network rinkeby  scripts/deploy.js
