//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.16;
import './UniswapV2Pair.sol';

contract CalHash {
    function getInitHash() public pure returns(bytes32){
        bytes memory bytecode = type(UniswapV2Pair).creationCode;
        return keccak256(abi.encodePacked(bytecode));
    }
}