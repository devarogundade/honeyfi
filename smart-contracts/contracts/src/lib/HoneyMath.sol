// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

library HoneyMath {
    uint256 public constant DENOMINATOR = 1_000_000;

    // This function extracts the percentage of the value.
    // The `percentage` is expected to be a value between 0 and DENOMINATOR.
    function extract(
        uint256 value,
        uint256 percentage
    ) external pure returns (uint256) {
        require(percentage <= DENOMINATOR, "Percentage cannot exceed 100%");
        return (value * percentage) / DENOMINATOR;
    }
}
