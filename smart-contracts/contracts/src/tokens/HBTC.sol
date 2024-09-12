// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HBTC is ERC20 {
    constructor() ERC20("Honey DAI", "HBTC") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function freeMint() external {
        _mint(msg.sender, 100 * 10 ** decimals());
    }
}
