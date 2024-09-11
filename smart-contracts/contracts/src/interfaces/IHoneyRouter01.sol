// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

interface IHoneyRouter01 {
    function swapTokensToTokens(
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint256 amountOutMin,
        uint256 deadline,
        uint256 destinationChainSelector
    ) external payable;
}
