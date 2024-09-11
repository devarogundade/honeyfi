// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

interface IHoneyExecutor {
    function swapTokensToTokens(
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint256 amountOutMin,
        uint256 deadline
    ) external payable returns (uint256);

    function getRouterCount() external view returns (uint256);
}
