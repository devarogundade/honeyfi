// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

interface IHoneyRouter01 {
    function swapETHToTokens(
        address tokenOut,
        uint256 amountOutMin,
        uint256 destinationChainSelector
    ) external payable;

    function swapTokensToETH(
        address tokenIn,
        uint256 amountIn,
        uint256 amountOutMin,
        uint256 destinationChainSelector
    ) external payable;

    function swapTokensToTokens(
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint256 amountOutMin,
        uint256 destinationChainSelector
    ) external payable;

    function getEquitoFee() external view returns (uint256);
}
