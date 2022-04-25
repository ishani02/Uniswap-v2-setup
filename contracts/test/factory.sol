//SPDX-License-Identifier: UNLICENSED
//pragma solidity >=0.5.16;
pragma solidity >=0.8.7;

import "@uniswap/v2-core/contracts/UniswapV2Factory.sol";

contract factory is UniswapV2Factory{

    constructor() UniswapV2Factory(msg.sender){

    }

}