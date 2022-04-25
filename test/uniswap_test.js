const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { BigNumber } = require("ethers");
//const { factory } = require("typescript");
//const BigNumber = require('bignumber.js');

function expandTo18Decimals(n) {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18));
}

function numberValue(n) {
  let num = Math.floor(n / 1e18);
  return num;
}

describe("uniswap", () => {
  let token, owner, router, Weth;

  beforeEach(async () => {
    // getInit = await ethers.getContractFactory("CalHash");
    // initHash = await getInit.deploy();
    // console.log(await initHash.getInitHash());

    accounts = await ethers.getSigners();
    owner = await accounts[0];

    getToken = await ethers.getContractFactory("BAFT");
    getFactory = await ethers.getContractFactory("@uniswap/v2-core/contracts/UniswapV2Factory.sol:UniswapV2Factory");
    getRouter = await ethers.getContractFactory("UniswapV2Router02");
    getWETH = await ethers.getContractFactory("WETH9");
    getPair = await ethers.getContractFactory("contracts/UniswapV2Pair.sol:UniswapV2Pair");

    factory = await getFactory.deploy(owner.address);
    pair = await getPair.deploy();
    Weth = await getWETH.deploy();
    router = await getRouter.deploy(factory.address, Weth.address);

    token = await getToken.deploy(owner.address);
    token1 = await getToken.deploy(owner.address);

    token.mint(owner.address, expandTo18Decimals(1000));
    token1.mint(owner.address, expandTo18Decimals(1000));
  });

  describe("uniswap hardhat", async () => {
    //-------------- ADD LIQUIDITY --------------

    it("add liquidity", async () => {
      await token.approve(router.address, expandTo18Decimals(1000));
      await token1.approve(router.address, expandTo18Decimals(1000));
      await router.addLiquidity(token1.address, token.address, expandTo18Decimals(100), expandTo18Decimals(100), expandTo18Decimals(1), expandTo18Decimals(1), owner.address, 1677848557);

      const Pair = await factory.getPair(token1.address, token.address); // token pair
      ans = await pair.attach(Pair); // To attach token pair with the uniswapV2Pair contract and access it's functions
      result = await ans.getReserves();
      reserve0 = result._reserve0;
      reserve1 = result._reserve1;

      expect(Number(reserve0)).to.be.lessThanOrEqual(Number(expandTo18Decimals(100)));
      expect(Number(reserve1)).to.be.lessThanOrEqual(Number(expandTo18Decimals(100)));
    });

    it("addLiquidityETH", async () => {
      await token.approve(router.address, expandTo18Decimals(1000));
      await router.addLiquidityETH(token.address, expandTo18Decimals(10), expandTo18Decimals(1), expandTo18Decimals(1), owner.address, 1677848557, { value: expandTo18Decimals(10) });

      const Pair = await factory.getPair(token.address, Weth.address); // token pair
      ans = await pair.attach(Pair); // To attach token pair with the uniswapV2Pair contract and access it's functions

      result = await ans.getReserves();
      reserve0 = result._reserve0;
      reserve1 = result._reserve1;

      expect(Number(reserve0)).to.be.equal(Number(expandTo18Decimals(10)));
      expect(Number(reserve1)).to.be.equal(Number(expandTo18Decimals(10)));
    });

    it("addLiquidity fails if user adds tokens more than approved number", async () => {
      await token.connect(owner).transfer(accounts[1].address, expandTo18Decimals(100));
      await token1.connect(owner).transfer(accounts[1].address, expandTo18Decimals(100));

      await token.connect(accounts[1]).approve(router.address, expandTo18Decimals(10));
      await token1.connect(accounts[1]).approve(router.address, expandTo18Decimals(10));

      await expect(router.connect(accounts[1]).addLiquidity(token1.address, token.address, expandTo18Decimals(100), expandTo18Decimals(100), expandTo18Decimals(1), expandTo18Decimals(1), owner.address, 1677848557)).to.be.revertedWith("TransferHelper::transferFrom: transferFrom failed");
    });

    it("addLiquidity fails if user adds tokens more than balance", async () => {
      await token.connect(owner).transfer(accounts[1].address, expandTo18Decimals(10));
      await token1.connect(owner).transfer(accounts[1].address, expandTo18Decimals(10));

      await token.connect(accounts[1]).approve(router.address, expandTo18Decimals(1000));
      await token1.connect(accounts[1]).approve(router.address, expandTo18Decimals(1000));

      await expect(router.connect(accounts[1]).addLiquidity(token1.address, token.address, expandTo18Decimals(20), expandTo18Decimals(100), expandTo18Decimals(1), expandTo18Decimals(1), owner.address, 1677848557)).to.be.revertedWith("TransferHelper::transferFrom: transferFrom failed");
    });

    //------------- SWAPPING ---------------

    it("swapExactTokensForTokens", async () => {
      await token.approve(router.address, expandTo18Decimals(1000));
      await token1.approve(router.address, expandTo18Decimals(1000));
      await router.addLiquidity(token1.address, token.address, expandTo18Decimals(100), expandTo18Decimals(100), expandTo18Decimals(1), expandTo18Decimals(1), owner.address, 1677848557);

      const Pair = await factory.getPair(token1.address, token.address); // token pair
      ans = await pair.attach(Pair); // To attach token pair with the uniswapV2Pair contract and access it's functions
      result = await ans.getReserves();
      reserve1 = result._reserve1;

      router.swapExactTokensForTokens(expandTo18Decimals(10), expandTo18Decimals(1), [token.address, token1.address], owner.address, 1677848557);

      ans = await pair.attach(Pair); // To attach token pair with the uniswapV2Pair contract and access it's functions
      result = await ans.getReserves();
      reserve0 = result._reserve0;
      reserve1New = result._reserve1;
      // console.log("reserve0, reserve1",numberValue(reserve0), Number(reserve1New));
      expect(Number(reserve1)).to.be.lessThanOrEqual(Number(expandTo18Decimals(reserve1New))); // value of token increases
      //  expect(numberValue(reserve1)).to.be.equal(110); // value of token1 decreases
    });

    it("swapTokensForExactTokens", async () => {
      await token.approve(router.address, expandTo18Decimals(1000));
      await token1.approve(router.address, expandTo18Decimals(1000));
      await router.addLiquidity(token1.address, token.address, expandTo18Decimals(100), expandTo18Decimals(100), expandTo18Decimals(1), expandTo18Decimals(1), owner.address, 1677848557);

      router.swapTokensForExactTokens(expandTo18Decimals(10), expandTo18Decimals(20), [token1.address, token.address], owner.address, 1677848557);

      const Pair = await factory.getPair(token1.address, token.address); // token pair
      ans = await pair.attach(Pair); // To attach token pair with the uniswapV2Pair contract and access it's functions
      result = await ans.getReserves();
      reserve0 = result._reserve0;
      reserve1 = result._reserve1;
      //console.log("reserve0, reserve1",Number(reserve0), Number(reserve1));
      expect(numberValue(reserve0)).to.be.lessThanOrEqual(Number(expandTo18Decimals(90))); // value of token increases
    });

    it("swapExactEthForTokens", async () => {
      await token.approve(router.address, expandTo18Decimals(1000));
      //await Weth.approve(router.address, expandTo18Decimals(1000));
      await router.addLiquidityETH(token.address, expandTo18Decimals(200), expandTo18Decimals(1), expandTo18Decimals(1), owner.address, 1677848557, { value: expandTo18Decimals(200) });

      router.swapExactETHForTokens(expandTo18Decimals(1), [Weth.address, token.address], owner.address, 1677848557, { value: expandTo18Decimals(10) });

      const Pair = await factory.getPair(token.address, Weth.address); // token pair
      ans = await pair.attach(Pair); // To attach token pair with the uniswapV2Pair contract and access it's functions

      result = await ans.getReserves();
      reserve0 = result._reserve0;
      reserve1 = result._reserve1;
    
      expect(Number(reserve1)).to.be.greaterThanOrEqual(Number(expandTo18Decimals(200))); //Amount of ETH in pool increases
    });

    it("swapTokensForExactETH", async () => {
      await token.approve(router.address, expandTo18Decimals(1000));
      await router.addLiquidityETH(token.address, expandTo18Decimals(15), expandTo18Decimals(1), expandTo18Decimals(1), owner.address, 1677848557, { value: expandTo18Decimals(15) });

      router.swapTokensForExactETH(expandTo18Decimals(5), expandTo18Decimals(10), [token.address, Weth.address], owner.address, 1677848557);

      const Pair = await factory.getPair(token.address, Weth.address); // token pair
      ans = await pair.attach(Pair); // To attach token pair with the uniswapV2Pair contract and access it's functions

      result = await ans.getReserves();
      reserve0 = result._reserve0;
      reserve1 = result._reserve1;

      expect(Number(reserve1)).to.be.lessThanOrEqual(Number(expandTo18Decimals(15))); // Amount of ETH decreases
    });

    it("swapExactTokensForETH", async () => {
      await token.approve(router.address, expandTo18Decimals(1000));
      await router.addLiquidityETH(token.address, expandTo18Decimals(10), expandTo18Decimals(1), expandTo18Decimals(1), owner.address, 1677848557, { value: expandTo18Decimals(10) });

      await router.swapExactTokensForETH(expandTo18Decimals(5), expandTo18Decimals(1), [token.address, Weth.address], owner.address, 1677848557);

      const Pair = await factory.getPair(token.address, Weth.address); // token pair
      ans = await pair.attach(Pair); // To attach token pair with the uniswapV2Pair contract and access it's functions

      result = await ans.getReserves();
      reserve0 = result._reserve0;
      reserve1 = result._reserve1;

      expect(Number(reserve0)).to.be.lessThanOrEqual(Number(expandTo18Decimals(10))); //Amount of ETH in pool decreases
    });

    it("swapETHForExactTokens", async () => {
      await token.approve(router.address, expandTo18Decimals(1000));
      await router.addLiquidityETH(token.address, expandTo18Decimals(50), expandTo18Decimals(1), expandTo18Decimals(1), owner.address, 1677848557, { value: expandTo18Decimals(30) });

      await router.swapETHForExactTokens(expandTo18Decimals(5), [Weth.address, token.address], owner.address, 1677848557, { value: expandTo18Decimals(10) });

      const Pair = await factory.getPair(token.address, Weth.address); // token pair
      ans = await pair.attach(Pair); // To attach token pair with the uniswapV2Pair contract and access it's functions

      result = await ans.getReserves();
      reserve0 = result._reserve0;
      reserve1 = result._reserve1;

      expect(Number(reserve0)).to.be.lessThanOrEqual(Number(expandTo18Decimals(50)));
    });

    it("swapETHForExactTokens fails if first value of path array is not Weth's address", async () => {
      await token.approve(router.address, expandTo18Decimals(1000));
      await router.addLiquidityETH(token.address, expandTo18Decimals(50), expandTo18Decimals(1), expandTo18Decimals(1), owner.address, 1677848557, { value: expandTo18Decimals(30) });

      await expect(router.swapETHForExactTokens(expandTo18Decimals(5), [token.address, Weth.address], owner.address, 1677848557, { value: expandTo18Decimals(10) })).to.be.revertedWith("UniswapV2Router: INVALID_PATH");
    });

    // ---------- REMOVE LIQUIDITY ----------

    it("removeLiquidity using all lp tokens", async () => {
      await token.approve(router.address, expandTo18Decimals(1000));
      await token1.approve(router.address, expandTo18Decimals(1000));
      await router.addLiquidity(token1.address, token.address, expandTo18Decimals(100), expandTo18Decimals(100), expandTo18Decimals(1), expandTo18Decimals(1), owner.address, 1677848557);

      const Pair = await factory.getPair(token1.address, token.address); // token pair
      ans = await pair.attach(Pair);
      Reserves = await ans.getReserves();
      reserve0_old = await Reserves._reserve0;
      reserve1_old = await Reserves._reserve1;

      console.log("Reserves before removing liquidity: ", numberValue(reserve0_old), numberValue(reserve1_old));

      lpOld = await ans.balanceOf(owner.address); // lp token balnce in owner's account before removing liquidity
      tokenBalanceOld = await token.balanceOf(owner.address); // token balance in owner's account before remove liquidity
      console.log("lp tokens initially : ", numberValue(lpOld));

      await ans.approve(router.address, expandTo18Decimals(1000));
      await router.connect(owner).removeLiquidity(token.address, token1.address, lpOld, expandTo18Decimals(1), expandTo18Decimals(1), owner.address, 1677848557);

      lpNew = await ans.balanceOf(owner.address); // lp token balnce in owner's account before removing liquidity
      tokenBalanceNew = await token.balanceOf(owner.address); // token balance in owner's account before remove liquidity
      console.log("lp tokens remaining: ", numberValue(lpNew));

      result = await ans.getReserves();
      reserve0_new = await result._reserve0;
      reserve1_new = await result._reserve1;

      console.log("Reserves after removing liquidity: ", numberValue(reserve0_new), numberValue(reserve1_new));

      console.log("Percentage of tokens still in the pool " + ((numberValue(reserve0_new) / numberValue(reserve0_old)) * 100) + "%");
      console.log("Percentage of tokens1 still in the pool " + ((numberValue(reserve1_new) / numberValue(reserve1_old)) * 100) + "%");

      expect(Number(lpOld)).to.be.greaterThanOrEqual(Number(lpNew));
    });

    it("removeLiquidity using some lp tokens", async () => {
      await token.approve(router.address, expandTo18Decimals(1000));
      await token1.approve(router.address, expandTo18Decimals(1000));
      await router.addLiquidity(token1.address, token.address, expandTo18Decimals(100), expandTo18Decimals(100), expandTo18Decimals(1), expandTo18Decimals(1), owner.address, 1677848557);

      const Pair = await factory.getPair(token1.address, token.address); // token pair
      ans = await pair.attach(Pair);
      Reserves = await ans.getReserves();
      reserve0_old = await Reserves._reserve0;
      reserve1_old = await Reserves._reserve1;

      console.log("Reserves before removing liquidity: ", numberValue(reserve0_old), numberValue(reserve1_old));

      lpOld = await ans.balanceOf(owner.address); // lp token balnce in owner's account before removing liquidity
      tokenBalanceOld = await token.balanceOf(owner.address); // token balance in owner's account before remove liquidity
      console.log("lp tokens initially : ", numberValue(lpOld));

      await ans.approve(router.address, expandTo18Decimals(1000));
      await router.connect(owner).removeLiquidity(token.address, token1.address, expandTo18Decimals(25), expandTo18Decimals(1), expandTo18Decimals(1), owner.address, 1677848557);

      lpNew = await ans.balanceOf(owner.address); // lp token balnce in owner's account before removing liquidity
      tokenBalanceNew = await token.balanceOf(owner.address); // token balance in owner's account before remove liquidity
      console.log("lp tokens remaining: ", numberValue(lpNew));

      result = await ans.getReserves();
      reserve0_new = await result._reserve0;
      reserve1_new = await result._reserve1;

      console.log("Reserves after removing liquidity: ", numberValue(reserve0_new), numberValue(reserve1_new));

      console.log("Percentage of tokens still in the pool " + ((Number(reserve0_new) / Number(reserve0_old)) * 100) + "%");
      console.log("Percentage of tokens1 still in the pool " + ((Number(reserve1_new) / Number(reserve1_old)) * 100) + "%");

      expect(Number(lpOld)).to.be.greaterThanOrEqual(Number(lpNew));

    });

    it("removeLiquidityETH using all lp tokens", async () => {
      await token.approve(router.address, expandTo18Decimals(1000));
      await router.addLiquidityETH(token.address, expandTo18Decimals(500), expandTo18Decimals(1), expandTo18Decimals(1), owner.address, 1677848557, { value: expandTo18Decimals(500) });

      const Pair = await factory.getPair(token.address, Weth.address); // token pair
      ans = await pair.attach(Pair);
      Reserves = await ans.getReserves();
      reserve0_old = await Reserves._reserve0;
      reserve1_old = await Reserves._reserve1;

      console.log("Reserves before removing liquidity: ", numberValue(reserve0_old), numberValue(reserve1_old));

      lpOld = await ans.balanceOf(owner.address); // lp token balnce in owner's account before removing liquidity
      tokenBalanceOld = await token.balanceOf(owner.address); // token balance in owner's account before remove liquidity
      console.log("lp tokens initially : ", numberValue(lpOld));

      await ans.approve(router.address, expandTo18Decimals(1000));
      await router.connect(owner).removeLiquidityETH(token.address, lpOld, expandTo18Decimals(1), expandTo18Decimals(1), owner.address, 1677848557);

      lpNew = await ans.balanceOf(owner.address); // lp token balnce in owner's account before removing liquidity
      tokenBalanceNew = await token.balanceOf(owner.address); // token balance in owner's account before remove liquidity
      console.log("lp tokens remaining: ", numberValue(lpNew));

      result = await ans.getReserves();
      reserve0_new = await result._reserve0;
      reserve1_new = await result._reserve1;

      console.log("Reserves after removing liquidity: ", numberValue(reserve0_new), numberValue(reserve1_new));

      console.log("Percentage of tokens still in the pool " + ((numberValue(reserve0_new) / numberValue(reserve0_old)) * 100) + "%");
      console.log("Percentage of tokens1 still in the pool " + ((numberValue(reserve1_new) / numberValue(reserve1_old)) * 100) + "%");

      expect(Number(lpOld)).to.be.greaterThanOrEqual(Number(lpNew));
    });


  });
});