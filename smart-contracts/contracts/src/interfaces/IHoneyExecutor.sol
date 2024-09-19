// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

interface IHoneyExecutor {
    // Struct to store router information
    struct Router {
        string name;
        string routerURI;
    }

    function swapETHToTokens(
        uint256 amountIn,
        address tokenOut,
        uint256 amountOutMin,
        uint256 deadline
    ) external payable returns (uint256);

    function swapTokensToTokens(
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint256 amountOutMin,
        uint256 deadline
    ) external payable returns (uint256);

    function bestSwapETHToTokens(
        uint256 amountIn,
        address tokenOut
    ) external view returns (uint256, address routerId, Router memory);

    function bestSwapTokensToTokens(
        uint256 amountIn,
        address tokenIn,
        address tokenOut
    ) external view returns (uint256, address routerId, Router memory);

    function addRouter(
        string calldata name,
        string calldata routerURI,
        address routerId
    ) external;

    function removeRouter(address routerId) external;

    function getRouterCount() external view returns (uint256);
}
