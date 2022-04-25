//SPDX-License-Identifier: UNLICENSED
//pragma solidity >=0.6.6;
pragma solidity >=0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BAFT is ERC20, Ownable {
    constructor(address _owner) ERC20("Beauty and Fashion Token", "BAFT") {
        _mint(_owner, 1000000000 * (10**decimals()));
        transferOwnership(_owner);
    }

    function mint(address _to, uint256 _value) public onlyOwner returns (bool){
        // require(totalSupply().add(_value) <= MAX_SUPPLY);
        _mint(_to, _value);
        return true;
        }
}
