// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

interface IBasicRouter {
    // Events
    event TokenSwap(
        address indexed from,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );
    event EthToTokenSwap(
        address indexed from,
        uint256 amountIn,
        address indexed tokenOut,
        uint256 amountOut
    );
    event TokenToEthSwap(
        address indexed from,
        address indexed tokenIn,
        uint256 amountIn,
        uint256 amountOut
    );

    function weth() external pure returns (address);

    // Set the price of a token in USD (in wei format, where 1 USD = 10^18)
    function setTokenPrice(address token, uint256 priceUSD) external;

    // Get the calculated amountOut based on token prices
    function getAmountOut(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view returns (uint256);

    // Swap from one token to another using stored USD prices
    function swapTokenToToken(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        address to
    ) external returns (uint256);

    // Swap ETH to token using stored USD prices
    function swapETHToTokens(
        address tokenOut,
        address to
    ) external payable returns (uint256);

    // Swap Token to ETH using stored USD prices
    function swapTokensToETH(
        address tokenIn,
        uint256 amountIn,
        address to
    ) external returns (uint256);
}
