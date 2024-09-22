// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

import {IBasicRouter} from "./interfaces/IBasicRouter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract BasicRouter is IBasicRouter, AccessControl {
    using SafeERC20 for IERC20;

    address private constant WETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    // Mapping to store token prices in USD (1 token = price in USD)
    mapping(address => uint256) public tokenPricesUSD;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function weth() external pure override returns (address) {
        return WETH;
    }

    // Set the price of a token in USD (in wei format, where 1 USD)
    function setTokenPrice(
        address token,
        uint256 priceUSD
    ) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        tokenPricesUSD[token] = priceUSD;
    }

    // Calculate token amountOut based on USD price
    function getAmountOut(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) public view returns (uint256) {
        uint256 priceIn = tokenPricesUSD[tokenIn]; // Price of tokenIn in USD
        uint256 priceOut = tokenPricesUSD[tokenOut]; // Price of tokenOut in USD

        require(priceIn > 0 && priceOut > 0, "Token price not set");

        // Calculate equivalent amount of tokenOut (keeping it proportional to USD value)
        return (amountIn * priceIn) / priceOut;
    }

    // Swap from one token to another using stored USD prices
    function swapTokenToToken(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        address to
    ) external override returns (uint256) {
        uint256 amountOut = getAmountOut(tokenIn, tokenOut, amountIn);

        // Transfer tokenIn from sender to contract
        IERC20(tokenIn).safeTransferFrom(_msgSender(), address(this), amountIn);

        // Ensure the contract has enough balance of tokenOut
        require(
            IERC20(tokenOut).balanceOf(address(this)) >= amountOut,
            "Insufficient output token balance"
        );

        // Transfer tokenOut to the receiver
        IERC20(tokenOut).safeTransfer(to, amountOut);

        emit TokenSwap(_msgSender(), tokenIn, tokenOut, amountIn, amountOut);

        return amountOut;
    }

    // Swap ETH to token using stored USD prices
    function swapETHToTokens(
        address tokenOut,
        address to
    ) external payable override returns (uint256) {
        require(msg.value > 0, "Must send ETH to swap");

        uint256 ethPriceUSD = tokenPricesUSD[WETH]; // Price of 1 ETH in USD
        uint256 tokenPriceUSD = tokenPricesUSD[tokenOut]; // Price of tokenOut in USD

        require(
            ethPriceUSD > 0 && tokenPriceUSD > 0,
            "ETH or Token price not set"
        );

        // Calculate amountOut (token equivalent of sent ETH)
        uint256 amountOut = (msg.value * ethPriceUSD) / tokenPriceUSD;

        require(
            IERC20(tokenOut).balanceOf(address(this)) >= amountOut,
            "Insufficient token balance"
        );

        // Transfer tokenOut to receiver
        IERC20(tokenOut).safeTransfer(to, amountOut);

        emit EthToTokenSwap(_msgSender(), msg.value, tokenOut, amountOut);

        return amountOut;
    }

    // Swap Token to ETH using stored USD prices
    function swapTokensToETH(
        address tokenIn,
        uint256 amountIn,
        address to
    ) external override returns (uint256) {
        uint256 ethPriceUSD = tokenPricesUSD[WETH]; // Price of 1 ETH in USD
        uint256 tokenPriceUSD = tokenPricesUSD[tokenIn]; // Price of tokenIn in USD

        require(
            ethPriceUSD > 0 && tokenPriceUSD > 0,
            "ETH or Token price not set"
        );

        // Calculate amountOut (ETH equivalent of tokenIn)
        uint256 amountOut = (amountIn * tokenPriceUSD) / ethPriceUSD;

        // Transfer tokenIn from sender to contract
        IERC20(tokenIn).transferFrom(_msgSender(), address(this), amountIn);

        require(address(this).balance >= amountOut, "Insufficient ETH balance");

        // Send ETH to receiver
        payable(to).transfer(amountOut);

        emit TokenToEthSwap(_msgSender(), tokenIn, amountIn, amountOut);

        return amountOut;
    }

    // Fallback function to receive ETH
    receive() external payable {}
}
