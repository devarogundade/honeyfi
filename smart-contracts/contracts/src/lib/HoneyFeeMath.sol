// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

library HoneyFeeMath {
    uint256 public constant DENOMINATOR = 1_000_000;
    uint256 public constant HONEY_FEE_PERCENTAGE = 1_000; // 0.1%

    // @params amount out from swap
    // @returns final amount out, honeyFee
    function split(uint256 amount) public pure returns (uint256, uint256) {
        uint256 honeyFee = extract(amount, HONEY_FEE_PERCENTAGE);
        return ((amount - honeyFee), honeyFee);
    }

    // This function extracts the percentage of the value.
    // The `percentage` is expected to be a value between 0 and DENOMINATOR.
    function extract(
        uint256 value,
        uint256 percentage
    ) public pure returns (uint256) {
        require(percentage <= DENOMINATOR, "Percentage cannot exceed 100%");
        return (value * percentage) / DENOMINATOR;
    }
}
