// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

import "./HoneyErrors.sol";
import "../lib/libraries/EquitoMessageLibrary.sol";
import {HoneyFeeMath} from "./lib/HoneyFeeMath.sol";
import {IHoneyRouter01} from "./interfaces/IHoneyRouter01.sol";
import {ITokenMap} from "./interfaces/ITokenMap.sol";
import {HoneyFactory} from "./HoneyFactory.sol";
import {IHoneyFactory} from "./interfaces/IHoneyFactory.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {EquitoApp} from "../lib/EquitoApp.sol";
import {IHoneyExecutor} from "./interfaces/IHoneyExecutor.sol";
import {IHoneyPool} from "./interfaces/IHoneyPool.sol";
import {IHoneyETHPool} from "./interfaces/IHoneyETHPool.sol";
contract HoneyRouter01 is IHoneyRouter01, AccessControl, Pausable, EquitoApp {
    using SafeERC20 for IERC20;

    address private constant WETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    address public TREASURY;

    ITokenMap private tokenMap;
    IHoneyFactory private factory;
    IHoneyExecutor private executor;

    constructor(
        address _tokenMap,
        address _router,
        address _treasury
    ) EquitoApp(_router) {
        TREASURY = _treasury;

        tokenMap = ITokenMap(_tokenMap);

        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    // =================== MUTABLE  =================== //

    function swapETHToTokens(
        address tokenOut,
        uint256 amountOutMin,
        uint256 destinationChainSelector
    ) external payable override whenNotPaused {
        address sender = _msgSender();

        uint256 amountIn = 0;

        if (router.chainSelector() == destinationChainSelector) {
            amountIn = msg.value;
        } else {
            // cross chain swap
            uint256 equitoFee = router.getFee(address(this));
            amountIn = msg.value - equitoFee;
        }

        uint256 amountOut = executor.swapETHToTokens{value: amountIn}(
            tokenOut,
            amountOutMin,
            address(this)
        );

        if (router.chainSelector() == destinationChainSelector) {
            // no cross chain call
            // transfer Tokens to sender
            IERC20(tokenOut).safeTransfer(sender, amountOut);
        } else {
            address pool = factory.getPool(tokenOut);

            // deposit amountOut to pool
            IERC20(tokenOut).approve(pool, amountOut);
            IHoneyPool(pool).deposit(amountOut);

            // cross chain call to release Tokens on the destination chain.
            _crossChainCall(
                sender,
                destinationChainSelector,
                tokenOut,
                amountOut
            );
        }
    }

    function swapTokensToETH(
        address tokenIn,
        uint256 amountIn,
        uint256 amountOutMin,
        uint256 destinationChainSelector
    ) external payable override whenNotPaused {
        address sender = _msgSender();

        // Transfer token in to executor contract.
        IERC20(tokenIn).safeTransferFrom(sender, address(executor), amountIn);

        uint256 amountOut = executor.swapTokensToETH(
            tokenIn,
            amountIn,
            amountOutMin,
            address(this)
        );

        if (router.chainSelector() == destinationChainSelector) {
            // no cross chain call
            // transfer Tokens to sender
            payable(sender).transfer(amountOut);
        } else {
            address pool = factory.getPool(WETH);

            // deposit amountOut to pool
            IHoneyETHPool(pool).deposit{value: amountOut}();

            // cross chain call to release Tokens on the destination chain.
            _crossChainCall(sender, destinationChainSelector, WETH, amountOut);
        }
    }

    function swapTokensToTokens(
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint256 amountOutMin,
        uint256 destinationChainSelector
    ) external payable override whenNotPaused {
        address sender = _msgSender();

        // Transfer token in to executor contract.
        IERC20(tokenIn).safeTransferFrom(sender, address(executor), amountIn);

        uint256 amountOut = executor.swapTokensToTokens(
            tokenIn,
            amountIn,
            tokenOut,
            amountOutMin,
            address(this)
        );

        if (router.chainSelector() == destinationChainSelector) {
            // no cross chain call
            // transfer Tokens to sender
            IERC20(tokenOut).safeTransfer(sender, amountOut);
        } else {
            address pool = factory.getPool(tokenOut);

            // deposit amountOut to pool
            IERC20(tokenOut).approve(pool, amountOut);
            IHoneyPool(pool).deposit(amountOut);

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

    function toBase64(address value) public pure returns (bytes64 memory) {
        return EquitoMessageLibrary.addressToBytes64(value);
    }

    function getEquitoFee() external view override returns (uint256) {
        return router.getFee(address(this));
    }

    function bestRouter(
        uint256 amountIn,
        address tokenIn,
        address tokenOut
    ) external view returns (uint256, address, IHoneyExecutor.Router memory) {
        return executor.bestRouter(amountIn, tokenIn, tokenOut);
    }

    // =================== ADMIN FUNCTIONS =================== //

    function updateFactory(
        address newFactory
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        factory = IHoneyFactory(newFactory);
    }

    function updateExecutor(
        address newExecutor
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        executor = IHoneyExecutor(newExecutor);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unPause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // =================== INTERNAL =================== //

    function _releasedTokens(
        uint256 sourceChainSelector,
        address peerToken,
        address receiver,
        uint256 amountOut
    ) internal {
        address token = tokenMap.get(peerToken, sourceChainSelector);

        // Withdraw from pool to contract
        factory.withdrawFromPool(token, amountOut);

        (uint256 finalAmountOut, uint256 honeyFeeAmount) = HoneyFeeMath.split(
            amountOut
        );

        // transfer Tokens amount out to receiver
        IERC20(token).safeTransfer(receiver, finalAmountOut);

        // transfer Tokens honey fee amount to treasury
        IERC20(token).safeTransfer(TREASURY, honeyFeeAmount);
    }

    // =================== CROSS CHAIN =================== //

    function _crossChainCall(
        address receiver,
        uint256 destinationChainSelector,
        address tokenOut,
        uint256 amountOut
    ) internal {
        bytes memory data = abi.encode(tokenOut, receiver, amountOut);

        uint256 equitoFee = router.getFee(address(this));

        router.sendMessage{value: equitoFee}(
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

    // Fallback function to receive ETH
    receive() external payable {}
}
