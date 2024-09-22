// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

import "./HoneyErrors.sol";
import "../lib/libraries/EquitoMessageLibrary.sol";
import {EquitoApp} from "../lib/EquitoApp.sol";
import {ITokenMap} from "./interfaces/ITokenMap.sol";
import {IHoneyFactory} from "./interfaces/IHoneyFactory.sol";
import {IHoneyETHPool} from "./interfaces/IHoneyETHPool.sol";
import {IHoneyPool} from "./interfaces/IHoneyPool.sol";
import {HoneyETHPool} from "./pools/HoneyETHPool.sol";
import {HoneyERC20Pool} from "./pools/HoneyERC20Pool.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract HoneyFactory is EquitoApp, IHoneyFactory, AccessControl {
    bytes32 public constant HONEY_ROUTER_ROLE = keccak256("HONEY_ROUTER_ROLE");

    address private constant WETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    mapping(address => address) private _pools;

    ITokenMap private tokenMap;

    constructor(address _tokenMap, address _router) EquitoApp(_router) {
        tokenMap = ITokenMap(_tokenMap);
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function addRouter(
        address honeyRouter
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(HONEY_ROUTER_ROLE, honeyRouter);
    }

    function removeRouter(
        address honeyRouter
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(HONEY_ROUTER_ROLE, honeyRouter);
    }

    function createPool(address token) external override {
        if (_pools[token] != address(0)) {
            revert AlreadyExists();
        }

        if (token == WETH) {
            _pools[token] = address(new HoneyETHPool());
        } else {
            _pools[token] = address(new HoneyERC20Pool(token));
        }
    }

    function weth() external pure returns (address) {
        return WETH;
    }

    function getPool(address token) external view override returns (address) {
        return _getPool(token);
    }

    function getEquitoFee() external view returns (uint256) {
        return router.getFee(address(this));
    }

    function withdrawFromPool(
        address token,
        uint256 amount
    ) external onlyRole(HONEY_ROUTER_ROLE) {
        address receiver = _msgSender();

        if (token == WETH) {
            IHoneyETHPool(_pools[WETH]).withdraw(amount, receiver);
        } else {
            IHoneyPool(_pools[token]).withdraw(amount, receiver);
        }
    }

    function _releasedTokens(
        address peerToken,
        uint256 sourceChainSelector,
        address receiver,
        uint256 amount
    ) internal {
        address token = tokenMap.get(peerToken, sourceChainSelector);

        if (token == WETH) {
            IHoneyETHPool(_pools[WETH]).withdraw(amount, receiver);
        } else {
            IHoneyPool(_pools[token]).withdraw(amount, receiver);
        }

        emit ReleasedTokens(sourceChainSelector, receiver, amount);
    }

    function crossChainCall(
        address receiver,
        uint256 destinationChainSelector,
        address token,
        uint256 amount
    ) external payable override {
        bytes memory data = abi.encode(token, receiver, amount);

        router.sendMessage{value: msg.value}(
            peers[destinationChainSelector],
            destinationChainSelector,
            data
        );
    }

    function _receiveMessageFromPeer(
        EquitoMessage calldata message,
        bytes calldata data
    ) internal override {
        // decode incoming message data
        (address token, address receiver, uint256 amount) = abi.decode(
            data,
            (address, address, uint256)
        );

        // callback function
        _releasedTokens(token, message.sourceChainSelector, receiver, amount);
    }

    function _getPool(address token) internal view returns (address) {
        if (_pools[token] == address(0)) {
            revert NotCreated();
        }

        return _pools[token];
    }

    function toBase64(address value) public pure returns (bytes64 memory) {
        return EquitoMessageLibrary.addressToBytes64(value);
    }
}
