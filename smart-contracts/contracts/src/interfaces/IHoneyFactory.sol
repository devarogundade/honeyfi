// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

interface IHoneyFactory {
    event ReleasedTokens(
        uint256 sourceChainSelector,
        address receiver,
        uint256 amount
    );

    function createPool(address token) external;

    function getPool(address token) external view returns (address);

    function weth() external pure returns (address);

    function getEquitoFee() external view returns (uint256);

    function withdrawFromPool(address token, uint256 amount) external;

    function crossChainCall(
        address receiver,
        uint256 destinationChainSelector,
        address token,
        uint256 amount
    ) external payable;
}
