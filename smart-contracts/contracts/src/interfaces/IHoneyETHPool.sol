// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

interface IHoneyETHPool {
    function addLiquidity() external payable;

    function removeLiquidity(
        uint256 lpTokens,
        uint256 secondaryChainSelector
    ) external payable;

    function deposit() external payable;

    function withdraw(uint256 amount, address to) external;
}
