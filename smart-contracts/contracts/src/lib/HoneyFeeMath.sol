// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

import {HoneyMath} from "./HoneyMath.sol";

library HoneyFeeMath {
    uint256 public constant HONEY_FEE_PERCENTAGE = 1_000; // 0.1%

    // @params amount out from swap
    // @returns final amount out, honeyFee
    function split(uint256 amount) external pure returns (uint256, uint256) {
        uint256 honeyFee = HoneyMath.extract(amount, HONEY_FEE_PERCENTAGE);
        return ((amount - honeyFee), honeyFee);
    }
}
