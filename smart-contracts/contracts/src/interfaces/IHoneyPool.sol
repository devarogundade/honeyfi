// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

interface IHoneyPool {
    function addLiquidity(uint256 amount) external;

    function removeLiquidity(
        uint256 lpTokens,
        uint256 secondaryChainSelector
    ) external payable;

    function deposit(uint256 amount) external;

    function withdraw(uint256 amount, address to) external;
}
