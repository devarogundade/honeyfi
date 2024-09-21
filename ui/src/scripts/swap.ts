import type { Token, Chain, Router, Pool } from "./types";
import { readContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { config } from "./config";
import { honeyRouterAbi } from "@/abis/honey-router";
import { poolTokenAbi } from "@/abis/honey-pools";
import { WETH } from "./token";

export interface BestPrice {
    amountOut: bigint,
    routerId: string,
    router: Router;
}

export const honeyAddresses: { [key: number]: `0x${string}`; } = {
    97: '0x',
    421614: '0x5Ad213b02Ee414C2EaBe004A61774207faC5113c'
};

// in seconds
const DEFAULT_DDL = (): number => {
    return Number((Date.now() / 1000).toFixed(0) + 180);
};

export async function swapTokens(
    fromChain: Chain,
    toChain: Chain,
    fromToken: Token,
    toToken: Token,
    amountIn: bigint,
    amountOutMin: bigint
): Promise<`0x${string}` | null> {
    if (fromToken.addresses[fromChain.chainId] == WETH) {
        return await swapETHToTokens(
            fromChain,
            toChain,
            toToken,
            amountIn,
            amountOutMin
        );
    } else if (toToken.addresses[fromChain.chainId] == WETH) {
        // TO DO
        return null;
    } else {
        return await swapTokensToTokens(
            fromChain,
            toChain,
            fromToken,
            toToken,
            amountIn,
            amountOutMin
        );
    }
}

export async function getBestPrice(
    fromChain: Chain,
    fromToken: Token,
    toToken: Token,
    amountIn: bigint
): Promise<BestPrice | null> {
    if (fromToken.addresses[fromChain.chainId] == WETH) {
        return await bestSwapETHToTokens(
            fromChain,
            toToken,
            amountIn
        );
    } else if (toToken.addresses[fromChain.chainId] == WETH) {
        // TO DO
        return null;
    } else {
        return await bestSwapTokensToTokens(
            fromChain,
            fromToken,
            toToken,
            amountIn
        );
    }
}

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
            abi: poolTokenAbi,
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

async function bestSwapETHToTokens(
    fromChain: Chain,
    toToken: Token,
    amountIn: bigint
): Promise<BestPrice | null> {
    try {
        const result = await readContract(config, {
            abi: honeyRouterAbi,
            address: honeyAddresses[fromChain.chainId],
            functionName: 'bestSwapETHToTokens',
            args: [
                amountIn,
                toToken.addresses[fromChain.chainId]
            ],
            chainId: fromChain.chainId
        });

        // @ts-ignore
        return { amountOut: result[0], routerId: result[1], router: result[2] };
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function bestSwapTokensToTokens(
    fromChain: Chain,
    fromToken: Token,
    toToken: Token,
    amountIn: bigint
): Promise<BestPrice | null> {
    if (!fromToken.addresses[fromChain.chainId]) return null;
    if (!toToken.addresses[fromChain.chainId]) return null;

    try {
        const result = await readContract(config, {
            abi: honeyRouterAbi,
            address: honeyAddresses[fromChain.chainId],
            functionName: 'bestSwapTokensToTokens',
            args: [
                amountIn,
                fromToken.addresses[fromChain.chainId],
                toToken.addresses[fromChain.chainId]
            ],
            chainId: fromChain.chainId
        });

        // @ts-ignore
        return { amountOut: result[0], routerId: result[1], router: result[2] };
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function swapETHToTokens(
    fromChain: Chain,
    toChain: Chain,
    toToken: Token,
    amountIn: bigint,
    amountOutMin: bigint
): Promise<`0x${string}` | null> {
    if (!toToken.addresses[toChain.chainId]) return null;

    try {
        const result = await writeContract(config, {
            abi: honeyRouterAbi,
            address: honeyAddresses[fromChain.chainId],
            functionName: 'swapETHToTokens',
            args: [
                toToken.addresses[toChain.chainId],
                amountOutMin,
                DEFAULT_DDL(),
                toChain.equitoSelector
            ],
            value: amountIn,
            chainId: fromChain.chainId
        });

        const receipt = await waitForTransactionReceipt(config, { hash: result });

        return receipt.transactionHash;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function swapTokensToTokens(
    fromChain: Chain,
    toChain: Chain,
    fromToken: Token,
    toToken: Token,
    amountIn: bigint,
    amountOutMin: bigint
): Promise<`0x${string}` | null> {
    if (!fromToken.addresses[fromChain.chainId]) return null;
    if (!toToken.addresses[toChain.chainId]) return null;

    try {
        let equitoFee = BigInt(0);

        // cross chain swap
        if (fromChain.chainId != toChain.chainId) {
            equitoFee = await getEquitoFee(fromChain);
        }

        const result = await writeContract(config, {
            abi: honeyRouterAbi,
            address: honeyAddresses[fromChain.chainId],
            functionName: 'swapTokensToTokens',
            args: [
                fromToken.addresses[fromChain.chainId],
                amountIn,
                toToken.addresses[toChain.chainId],
                amountOutMin,
                DEFAULT_DDL(),
                toChain.equitoSelector
            ],
            value: equitoFee,
            chainId: fromChain.chainId
        });

        const receipt = await waitForTransactionReceipt(config, { hash: result });

        return receipt.transactionHash;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getEquitoFee(
    chain: Chain
): Promise<bigint> {
    try {
        // @ts-ignore
        return await readContract(config, {
            abi: honeyRouterAbi,
            address: honeyAddresses[chain.chainId],
            functionName: 'getEquitoFee',
            chainId: chain.chainId
        });
    } catch (error) {
        console.log(error);
        return BigInt(0);
    }
}