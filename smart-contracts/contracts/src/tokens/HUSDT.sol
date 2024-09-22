// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HUSDT is ERC20 {
    constructor() ERC20("Honey Tether USD", "HUSDT") {
        _mint(msg.sender, 1_000_000_000 * 10 ** decimals());
    }
}
