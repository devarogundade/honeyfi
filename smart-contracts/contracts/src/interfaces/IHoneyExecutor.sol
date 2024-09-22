// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

interface IHoneyExecutor {
    // Struct to store router information
    struct Router {
        string name;
        string routerURI;
    }

    function swapETHToTokens(
        address tokenOut,
        uint256 amountOutMin,
        address to
    ) external payable returns (uint256);

    function swapTokensToETH(
        address tokenIn,
        uint256 amountIn,
        uint256 amountOutMin,
        address to
    ) external payable returns (uint256);

    function swapTokensToTokens(
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint256 amountOutMin,
        address to
    ) external payable returns (uint256);

    function bestRouter(
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
