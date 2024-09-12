// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

import "./HoneyErrors.sol";
import "../lib/libraries/EquitoMessageLibrary.sol";
import {HoneyFeeMath} from "./lib/HoneyFeeMath.sol";
import {IHoneyRouter01} from "./interfaces/IHoneyRouter01.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {EquitoApp} from "../lib/EquitoApp.sol";
import {HoneyExecutor} from "./HoneyExecutor.sol";
import {IHoneyExecutor} from "./interfaces/IHoneyExecutor.sol";

contract HoneyRouter01 is IHoneyRouter01, AccessControl, Pausable, EquitoApp {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    address public EXECUTOR;
    address public TREASURY;
    uint256 public immutable CHAIN_SELECTOR;

    mapping(address => mapping(uint256 => address)) public _tokenPeers;

    constructor(
        address _router,
        address _treasury,
        uint256 _selector
    ) EquitoApp(_router) {
        CHAIN_SELECTOR = _selector;
        TREASURY = _treasury;

        EXECUTOR = address(new HoneyExecutor());

        _grantRole(ADMIN_ROLE, _msgSender());
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    // =================== MUTABLE  =================== //

    function swapTokensToTokens(
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint256 amountOutMin,
        uint256 deadline,
        uint256 destinationChainSelector
    ) external payable override whenNotPaused {
        address sender = _msgSender();

        // Transfer token in to executor contract.
        IERC20(tokenIn).safeTransferFrom(sender, EXECUTOR, amountIn);

        /// @notice Get tokenOut balance of contract.
        uint256 balanceBefore = IERC20(tokenOut).balanceOf(address(this));

        /// @notice Calculate tokenOut amount required.
        uint256 tokenOutAmountRequired = balanceBefore + amountOutMin;

        uint256 amountOut = IHoneyExecutor(EXECUTOR).swapTokensToTokens(
            tokenIn,
            amountIn,
            tokenOut,
            amountOutMin,
            deadline
        );

        uint256 balanceAfter = IERC20(tokenOut).balanceOf(address(this));

        /// @notice Check if tokenOut balance of contract is sufficient.
        if (balanceAfter < tokenOutAmountRequired) {
            revert InsufficientOutputAmount(
                tokenOutAmountRequired - balanceAfter,
                amountOutMin
            );
        }

        if (CHAIN_SELECTOR == destinationChainSelector) {
            // no cross chain call
            // transfer Tokens to sender
            IERC20(tokenOut).safeTransfer(sender, amountOut);
        } else {
            // cross chain call to release Tokens on the destination chain.
            _crossChainCall(
                sender,
                destinationChainSelector,
                tokenOut,
                amountOut
            );
        }
    }

    // =================== VIEW FUNCTIONS =================== //

    function bestRouter(
        uint256 amountIn,
        address tokenIn,
        address tokenOut
    ) external view returns (uint256, address) {
        return IHoneyExecutor(EXECUTOR).bestRouter(amountIn, tokenIn, tokenOut);
    }

    // =================== ADMIN FUNCTIONS =================== //

    function addTokenPeer(
        uint256 chainSelector,
        address tokenA,
        address tokenB
    ) external onlyRole(ADMIN_ROLE) {
        _tokenPeers[tokenA][chainSelector] = tokenB;
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unPause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function addRouter(
        string calldata name,
        string calldata routerURI,
        address routerId
    ) external onlyRole(ADMIN_ROLE) {
        IHoneyExecutor(EXECUTOR).addRouter(name, routerURI, routerId);
    }

    function removeRouter(address routerId) external onlyRole(ADMIN_ROLE) {
        IHoneyExecutor(EXECUTOR).removeRouter(routerId);
    }

    // =================== INTERNAL =================== //

    function _releasedTokens(
        uint256 sourceChainSelector,
        address tokenOut,
        address receiver,
        uint256 amountOut
    ) internal {
        (uint256 finalAmountOut, uint256 honeyFeeAmount) = HoneyFeeMath.split(
            amountOut
        );

        // transfer Tokens amount out to receiver
        IERC20(_tokenPeers[tokenOut][sourceChainSelector]).safeTransfer(
            receiver,
            finalAmountOut
        );

        // transfer Tokens honey fee amount to treasury
        IERC20(_tokenPeers[tokenOut][sourceChainSelector]).safeTransfer(
            TREASURY,
            honeyFeeAmount
        );
    }

    // =================== CROSS CHAIN =================== //

    function _crossChainCall(
        address receiver,
        uint256 destinationChainSelector,
        address tokenOut,
        uint256 amountOut
    ) internal {
        bytes memory data = abi.encode(tokenOut, receiver, amountOut);

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
        (address tokenOut, address receiver, uint256 amountOut) = abi.decode(
            data,
            (address, address, uint256)
        );

        // callback function
        _releasedTokens(
            message.sourceChainSelector,
            tokenOut,
            receiver,
            amountOut
        );
    }
}
