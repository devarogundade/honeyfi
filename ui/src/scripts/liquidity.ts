import type { Chain, Pool } from "./types";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { config } from "./config";
import { poolTokenAbi, poolETHAbi } from "@/abis/honey-pools";
import { getEquitoFee } from "./swap";
import { WETH } from "./token";

export async function addLiquidity(
    pool: Pool,
    chain: Chain,
    amount: bigint
): Promise<`0x${string}` | null> {
    if (pool.tokenAddress == WETH) {
        return addLiquidityETH(pool, chain, amount);
    }

    return addLiquidityToken(pool, chain, amount);
}

export async function removeLiquidity(
    pool: Pool,
    chain: Chain,
    secondaryChain: Chain,
    amount: bigint
): Promise<`0x${string}` | null> {
    if (pool.tokenAddress == WETH) {
        return removeLiquidityETH(pool, chain, secondaryChain, amount);
    }

    return removeLiquidityToken(pool, chain, secondaryChain, amount);
}

async function addLiquidityToken(
    pool: Pool,
    chain: Chain,
    amount: bigint
): Promise<`0x${string}` | null> {
    try {
        const result = await writeContract(config, {
            abi: poolTokenAbi,
            address: pool.poolAddress,
            functionName: 'addLiquidity',
            args: [
                amount
            ],
            chainId: chain.chainId
        });

        const receipt = await waitForTransactionReceipt(config, { hash: result });

        return receipt.transactionHash;
    } catch (error) {
        console.log(error);
        return null;
    }
}
async function addLiquidityETH(
    pool: Pool,
    chain: Chain,
    amount: bigint
): Promise<`0x${string}` | null> {
    try {
        const result = await writeContract(config, {
            abi: poolETHAbi,
            address: pool.poolAddress,
            functionName: 'addLiquidity',
            chainId: chain.chainId,
            value: amount
        });

        const receipt = await waitForTransactionReceipt(config, { hash: result });

        return receipt.transactionHash;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function removeLiquidityToken(
    pool: Pool,
    chain: Chain,
    secondaryChain: Chain,
    amount: bigint
): Promise<`0x${string}` | null> {
    try {
        let equitoFee = BigInt(0);

        equitoFee = await getEquitoFee(chain);

        const result = await writeContract(config, {
            abi: poolTokenAbi,
            address: pool.poolAddress,
            functionName: 'removeLiquidity',
            args: [
                amount,
                secondaryChain.equitoSelector
            ],
            value: equitoFee,
            chainId: chain.chainId
        });

        const receipt = await waitForTransactionReceipt(config, { hash: result });

        return receipt.transactionHash;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function removeLiquidityETH(
    pool: Pool,
    chain: Chain,
    secondaryChain: Chain,
    amount: bigint
): Promise<`0x${string}` | null> {
    try {
        let equitoFee = BigInt(0);

        equitoFee = await getEquitoFee(chain);

        const result = await writeContract(config, {
            abi: poolETHAbi,
            address: pool.poolAddress,
            functionName: 'removeLiquidity',
            args: [
                amount,
                secondaryChain.equitoSelector
            ],
            value: equitoFee,
            chainId: chain.chainId
        });

        const receipt = await waitForTransactionReceipt(config, { hash: result });

        return receipt.transactionHash;
    } catch (error) {
        console.log(error);
        return null;
    }
}