// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

error InsufficientWalletBalance(
    address account,
    uint256 balance,
    uint256 balanceNeeded
);
error AlreadyExists();
error NotCreated();
error SwapDoesNotExist(bytes32 orderId);
error SwapQuantityIsZero();
error InsufficientSwapInputValue();
error TokenInIsTokenOut();
error InsufficientOutputAmount(uint256 amountOut, uint256 expectedAmountOut);
error InsufficientInputAmount(uint256 amountIn, uint256 expectedAmountIn);
error InsufficientLiquidity();
error InsufficientMsgValue();
error AmountInIsZero();
error AddressIsZero();
error IdenticalTokenAddresses();
error InvalidInputTokenForSwapPlacement();
error SwapNotEligibleForRefresh(bytes32 orderId);
error AmountOutRequiredIsZero(bytes32 orderId);
error ExecutorNotCheckedIn();
error InvalidToAddressBits();
error V2SwapFailed();
error V3SwapFailed();
