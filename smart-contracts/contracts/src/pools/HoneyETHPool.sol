// SPDX-License-Identifier: MIT
pragma solidity <=0.8.24;

import "../HoneyErrors.sol";
import {IHoneyETHPool} from "../interfaces/IHoneyETHPool.sol";
import {IHoneyFactory} from "../interfaces/IHoneyFactory.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract HoneyETHPool is IHoneyETHPool, ERC20, AccessControl {
    using SafeERC20 for ERC20;

    uint256 private constant MINIMAL_LIQUIDITY = 10_000 * 1e18;

    // Total reserves of the token in the pool
    uint256 public totalReserves;

    IHoneyFactory private _factory;

    constructor() ERC20("HoneyPool LP Token", "HLP") {
        _factory = IHoneyFactory(_msgSender());

        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    // Adds liquidity to the pool in the form of the specified token
    function addLiquidity() external payable override {
        uint256 amount = msg.value;

        if (amount == 0) {
            revert AmountInIsZero();
        }

        address sender = _msgSender();

        uint256 lpTokensToMint;

        // If this is the first deposit, the liquidity is just the amount deposited
        if (totalReserves == 0) {
            lpTokensToMint = MINIMAL_LIQUIDITY;
        } else {
            // Calculate liquidity based on existing pool reserves and LP supply
            lpTokensToMint = (amount * totalSupply()) / totalReserves;
        }

        // Mint LP tokens to the user
        _mint(sender, lpTokensToMint);

        // Update total reserves
        totalReserves += amount;
    }

    function removeLiquidity(
        uint256 lpTokens,
        uint256 secondaryChainSelector
    ) external payable override {
        if (lpTokens == 0) {
            revert AmountInIsZero();
        }

        address sender = _msgSender();

        // Calculate the underlying token amount to return based on LP tokens
        uint256 amount = (lpTokens * totalReserves) / totalSupply();

        if (amount == 0) {
            revert AmountInIsZero();
        }

        // Burn the LP tokens
        _burn(sender, lpTokens);

        uint256 poolBalance = address(this).balance;

        if (poolBalance < amount) {
            uint256 equitoFee = _factory.getEquitoFee();

            // Extract equito fee from amount
            uint256 amountExcludingFee = amount - equitoFee;

            // Get the amount remain for user
            uint256 secondaryAmount = amountExcludingFee - poolBalance;

            // Transfer the underlying available tokens back to the user
            payable(sender).transfer(poolBalance);

            _factory.crossChainCall{value: equitoFee}(
                sender,
                secondaryChainSelector,
                _factory.weth(),
                secondaryAmount
            );
        } else {
            // Transfer the underlying tokens back to the user
            // Include unspent ETH
            payable(sender).transfer(amount + msg.value);
        }

        // Update total reserves
        totalReserves -= amount;
    }

    function deposit() external payable override {
        totalReserves += msg.value;
    }

    function withdraw(
        uint256 amount,
        address to
    ) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        // Transfer the underlying tokens back to the user
        payable(to).transfer(amount);
    }
}
