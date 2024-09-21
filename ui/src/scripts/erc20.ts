import { config } from './config';
import { waitForTransactionReceipt, getBalance, writeContract, readContract } from '@wagmi/core';
import { erc20Abi } from 'viem';
import type { Token, Chain, Pool } from './types';
import { WETH } from './token';

export async function getAllowance(
    token: Token,
    chain: Chain,
    address: `0x${string}`,
    spender: `0x${string}`
): Promise<bigint> {
    if (token.addresses[chain.chainId] == WETH) return BigInt(Number.MAX_VALUE);
    if (!token.addresses[chain.chainId]) return BigInt(0);

    try {
        return await readContract(config, {
            abi: erc20Abi,
            address: token.addresses[chain.chainId]!,
            functionName: 'allowance',
            args: [address, spender],
            chainId: chain.chainId
        });
    } catch (error) {
        console.log(error);
        return BigInt(0);
    }
}

export async function getLPAllowance(
    pool: Pool,
    chain: Chain,
    address: `0x${string}`,
    spender: `0x${string}`
) {
    try {
        return await readContract(config, {
            abi: erc20Abi,
            address: pool.poolAddress,
            functionName: 'allowance',
            args: [address, spender],
            chainId: chain.chainId
        });
    } catch (error) {
        console.log(error);
        return BigInt(0);
    }
}

export async function approveTokens(
    token: Token,
    chain: Chain,
    spender: `0x${string}`,
    amount: bigint
): Promise<`0x${string}` | null> {
    if (token.addresses[chain.chainId] == WETH || !token.addresses[chain.chainId]) return null;

    try {
        const result = await writeContract(config, {
            abi: erc20Abi,
            address: token.addresses[chain.chainId]!,
            functionName: 'approve',
            args: [spender, amount],
            chainId: chain.chainId
        });

        const receipt = await waitForTransactionReceipt(config, { hash: result });

        return receipt.transactionHash;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function approveLPTokens(
    pool: Pool,
    chain: Chain,
    spender: `0x${string}`,
    amount: bigint
): Promise<`0x${string}` | null> {
    try {
        const result = await writeContract(config, {
            abi: erc20Abi,
            address: pool.poolAddress,
            functionName: 'approve',
            args: [spender, amount],
            chainId: chain.chainId
        });

        const receipt = await waitForTransactionReceipt(config, { hash: result });

        return receipt.transactionHash;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getTokenBalance(
    token: Token,
    chain: Chain,
    address: `0x${string}`
): Promise<bigint> {
    try {
        const { value } = await getBalance(config, {
            token: token.addresses[chain.chainId] == WETH ? undefined : token.addresses[chain.chainId],
            address,
            chainId: chain.chainId
        });
        return value;
    } catch (error) {
        console.log(error);

        return BigInt(0);
    }
}

export async function getLPTokenBalance(
    pool: Pool,
    chain: Chain,
    address: `0x${string}`
) {
    try {
        const { value } = await getBalance(config, {
            token: pool.poolAddress,
            address,
            chainId: chain.chainId
        });
        return value;
    } catch (error) {
        console.log(error);

        return BigInt(0);
    }
}

export async function addToWallet(token: Token, chain: Chain): Promise<void> {
    try {
        if (token.addresses[chain.chainId] == WETH) return;

        // @ts-ignore
        await ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: token.addresses[chain.chainId],
                    symbol: token.symbol,
                    decimals: '18',
                    image: `https://honeyfi.netlify.app${token.image}`
                },
            },
        });
    } catch (error) {
        console.error(error);
    }
}