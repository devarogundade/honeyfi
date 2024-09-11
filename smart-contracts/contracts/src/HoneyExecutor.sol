// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

import "./HoneyErrors.sol";
import {IHoneyExecutor} from "./interfaces/IHoneyExecutor.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IUniswapV2Router01} from "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol";

contract HoneyExecutor is IHoneyExecutor, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // =================== STRUCT =================== //

    // Struct to store router information
    struct Router {
        string name;
        string routerURI;
    }

    // Mapping of DEX routers by address
    mapping(address => Router) public routers;
    address[] public routerIds; // Keeps track of registered routers

    constructor() {
        _grantRole(ADMIN_ROLE, _msgSender());
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    // =================== MUTABLE FUNCTIONS =================== //

    function swapTokensToTokens(
        address tokenIn, // Address of the token being swapped from
        uint256 amountIn, // Amount of tokenIn to swap
        address tokenOut, // Address of the token being swapped to
        uint256 amountOutMin, // Minimum amount of tokenOut the user expects to receive
        uint256 deadline // Time by which the swap must be completed (for time-based expiration)
    ) external payable override returns (uint256) {
        // Receiver of the swapped tokens is the caller of this function
        address receiver = _msgSender();

        // Find the best router for the swap and get the best output amount for the given input
        (uint256 bestAmountOut, address routerId) = _bestRouter(
            amountIn,
            tokenIn,
            tokenOut
        );

        // Revert the transaction if the best output amount is less than the minimum specified by the user
        if (bestAmountOut < amountOutMin) {
            revert InsufficientOutputAmount(bestAmountOut, amountOutMin);
        }

        // Create a path for the swap (tokenIn -> tokenOut)
        address[] memory path = new address[](2);
        path[0] = tokenIn; // Start with tokenIn
        path[1] = tokenOut; // End with tokenOut

        // Execute the token swap on the selected router
        // swapExactTokensForTokens performs the actual swap and returns an array of output amounts
        uint256[] memory amountsOut = IUniswapV2Router01(routerId)
            .swapExactTokensForTokens(
                amountIn, // The input token amount
                amountOutMin, // The minimum output token amount
                path, // The swap path
                receiver, // Address that will receive the swapped tokens
                deadline // The deadline by which the swap must be completed
            );

        // Return the actual output amount (the last value in the amountsOut array)
        return amountsOut[amountsOut.length - 1];
    }

    // =================== INTERNAL FUNCTIONS =================== //

    function _bestRouter(
        uint256 amountIn,
        address tokenIn,
        address tokenOut
    ) internal view returns (uint256, address) {
        // Initialize variables to store the best price and the corresponding router's address.
        uint256 bestPrice;
        address bestRouterId;

        // Loop through all router addresses stored in routerIds
        for (uint256 i = 0; i < routerIds.length; i++) {
            // Create a path array for the swap on the current router
            address[] memory path = new address[](2);
            path[0] = tokenIn; // Set tokenIn as the first element
            path[1] = tokenOut; // Set tokenOut as the second element

            // Get the output amount (price) for the given amountIn using the current router
            // IUniswapV2Router01 is an interface for the router, calling getAmountsOut to simulate the swap
            uint256[] memory amountsOut = IUniswapV2Router01(routerIds[i])
                .getAmountsOut(amountIn, path);

            // The price is the last element in the amountsOut array (the amount of tokenOut you receive)
            uint256 price = amountsOut[amountsOut.length - 1];

            // Compare the price to the current bestPrice and update if this one is better
            if (price > bestPrice) {
                bestPrice = price; // Update the best price
                bestRouterId = routerIds[i]; // Update the router that gives the best price
            }
        }

        // Return the best price and the corresponding router's address
        return (bestPrice, bestRouterId);
    }

    // =================== ADMIN FUNCTIONS =================== //

    // Function to add a new router
    function addRouter(
        string calldata name,
        string calldata routerURI,
        address routerId
    ) external onlyRole(ADMIN_ROLE) {
        routers[routerId] = Router(name, routerURI);
        routerIds.push(routerId);
    }

    // Function to remove a router
    function removeRouter(address routerId) external onlyRole(ADMIN_ROLE) {
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
}
