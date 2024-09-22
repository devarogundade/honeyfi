// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

import "./HoneyErrors.sol";
import {IHoneyExecutor} from "./interfaces/IHoneyExecutor.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IBasicRouter} from "../routers/interfaces/IBasicRouter.sol";

contract HoneyExecutor is IHoneyExecutor, AccessControl {
    using SafeERC20 for IERC20;

    address private constant WETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    // Mapping of DEX routers by address
    mapping(address => Router) public routers;
    address[] public routerIds; // Keeps track of registered routers

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    // =================== MUTABLE FUNCTIONS =================== //

    function swapETHToTokens(
        address tokenOut, // Address of the token being swapped to
        uint256 amountOutMin, // Minimum amount of tokenOut the user expects to receive
        address to
    ) external payable returns (uint256) {
        uint256 amountIn = msg.value;

        // Find the best router for the swap and get the best output amount for the given input
        (uint256 bestAmountOut, address routerId, ) = _bestRouter(
            amountIn,
            WETH,
            tokenOut
        );

        // Revert the transaction if the best output amount is less than the minimum specified by the user
        if (bestAmountOut < amountOutMin) {
            revert InsufficientOutputAmount(bestAmountOut, amountOutMin);
        }

        // Execute the token swap on the selected router
        // swapExactTokensForTokens performs the actual swap and returns an array of output amounts
        uint256 amountOut = IBasicRouter(routerId).swapETHToTokens{
            value: amountIn
        }(tokenOut, to);

        // Return the actual output amount
        return amountOut;
    }

    function swapTokensToETH(
        address tokenIn,
        uint256 amountIn,
        uint256 amountOutMin,
        address to
    ) external payable override returns (uint256) {
        // Find the best router for the swap and get the best output amount for the given input
        (uint256 bestAmountOut, address routerId, ) = _bestRouter(
            amountIn,
            tokenIn,
            WETH
        );

        // Revert the transaction if the best output amount is less than the minimum specified by the user
        if (bestAmountOut < amountOutMin) {
            revert InsufficientOutputAmount(bestAmountOut, amountOutMin);
        }

        // Approve router contract to spend tokens
        IERC20(tokenIn).approve(routerId, amountIn);

        // Execute the token swap on the selected router
        // swapExactTokensForTokens performs the actual swap and returns an array of output amounts
        uint256 amountOut = IBasicRouter(routerId).swapTokensToETH(
            tokenIn,
            amountIn,
            to
        );

        // Return the actual output amount
        return amountOut;
    }

    function swapTokensToTokens(
        address tokenIn, // Address of the token being swapped from
        uint256 amountIn, // Amount of tokenIn to swap
        address tokenOut, // Address of the token being swapped to
        uint256 amountOutMin, // Minimum amount of tokenOut the user expects to receive
        address to
    ) external payable override returns (uint256) {
        // Find the best router for the swap and get the best output amount for the given input
        (uint256 bestAmountOut, address routerId, ) = _bestRouter(
            amountIn,
            tokenIn,
            tokenOut
        );

        // Revert the transaction if the best output amount is less than the minimum specified by the user
        if (bestAmountOut < amountOutMin) {
            revert InsufficientOutputAmount(bestAmountOut, amountOutMin);
        }

        // Approve router contract to spend tokens
        IERC20(tokenIn).approve(routerId, amountIn);

        // Execute the token swap on the selected router
        // swapExactTokensForTokens performs the actual swap and returns an array of output amounts
        uint256 amountOut = IBasicRouter(routerId).swapTokenToToken(
            tokenIn,
            tokenOut,
            amountIn,
            to
        );

        // Return the actual output amount
        return amountOut;
    }

    function bestRouter(
        uint256 amountIn,
        address tokenIn,
        address tokenOut
    ) external view override returns (uint256, address, Router memory) {
        return _bestRouter(amountIn, tokenIn, tokenOut);
    }

    // =================== INTERNAL FUNCTIONS =================== //

    function _bestRouter(
        uint256 amountIn,
        address tokenIn,
        address tokenOut
    ) internal view returns (uint256, address, Router memory) {
        // Initialize variables to store the best price and the corresponding router's address.
        uint256 bestPrice;
        address bestRouterId;

        // Loop through all router addresses stored in routerIds
        for (uint256 i = 0; i < routerIds.length; i++) {
            // Get the output amount (price) for the given amountIn using the current router
            // IBasicRouter is an interface for the router, calling getAmountOut to simulate the swap
            uint256 amountOut = IBasicRouter(routerIds[i]).getAmountOut(
                tokenIn,
                tokenOut,
                amountIn
            );

            // Compare the price to the current bestPrice and update if this one is better
            if (amountOut > bestPrice) {
                bestPrice = amountOut; // Update the best price
                bestRouterId = routerIds[i]; // Update the router that gives the best price
            }
        }

        // Return the best price and the corresponding router's address
        return (bestPrice, bestRouterId, routers[bestRouterId]);
    }

    // =================== ADMIN FUNCTIONS =================== //

    // Function to add a new router
    function addRouter(
        string calldata name,
        string calldata routerURI,
        address routerId
    ) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        routers[routerId] = Router(name, routerURI);
        routerIds.push(routerId);
    }

    // Function to remove a router
    function removeRouter(
        address routerId
    ) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        delete routers[routerId];

        // Find and remove the routerId from the array
        for (uint256 i = 0; i < routerIds.length; i++) {
            if (routerIds[i] == routerId) {
                routerIds[i] = routerIds[routerIds.length - 1]; // Move the last element into the place of the removed element
                routerIds.pop(); // Remove the last element (now duplicated)
                break; // Exit the loop once the element is removed
            }
        }
    }

    // =================== VIEW FUNCTIONS =================== //

    // Retrieve the number of registered routers
    function getRouterCount() external view override returns (uint256) {
        return routerIds.length;
    }

    // Get details of a router by index
    function getRouter(address routerId) external view returns (Router memory) {
        return routers[routerId];
    }

    // Fallback function to receive ETH
    receive() external payable {}
}
