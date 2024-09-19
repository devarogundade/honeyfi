// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

interface ITokenMap {
    function set(address token, uint256 chainId, address mappedToken) external;

    function get(
        address token,
        uint256 chainId
    ) external view returns (address);
}
