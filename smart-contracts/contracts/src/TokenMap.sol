// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

import "./HoneyErrors.sol";
import {ITokenMap} from "./interfaces/ITokenMap.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract TokenMap is ITokenMap, AccessControl {
    // Mapping: token address => chain ID => token address on the destination chain
    mapping(address => mapping(uint256 => address)) private tokenMappings;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    // Function to set the token mapping from one chain to another
    function set(
        address token,
        uint256 chainId,
        address mappedToken
    ) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        if (token == address(0) || mappedToken == address(0)) {
            revert AddressIsZero();
        }

        tokenMappings[token][chainId] = mappedToken;
    }

    // Function to retrieve the mapped token address for a given token and chain ID
    function get(
        address token,
        uint256 chainId
    ) external view override returns (address) {
        return tokenMappings[token][chainId];
    }
}
