import type { Token, Chain, Router, Pool } from "./types";
import { readContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { config } from "./config";
import { honeyRouterAbi } from "@/abis/honey-router";
import { WETH } from "./token";

export interface BestPrice {
    amountOut: bigint,
    routerId: string,
    router: Router;
}

export const honeyFactories: { [key: number]: `0x${string}`; } = {
    97: '0x87619381D1176d15811efb4ef8Fd84D1243d6DD4',
    421614: '0x8207EaE49615c6725646f998ba55Fcdcf859d447'
};

export const honeyRouters: { [key: number]: `0x${string}`; } = {
    97: '0x35aC37059E0756D0460290254a197982905ED909',
    421614: '0xdD7276F4e1983006033d583426e0D7947A7c14c8'
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
        return swapTokensToETH(
            fromChain,
            toChain,
            fromToken,
            amountIn,
            amountOutMin
        );
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

export async function getBestRouter(
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
            address: honeyRouters[fromChain.chainId],
            functionName: 'bestRouter',
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
            address: honeyRouters[fromChain.chainId],
            functionName: 'swapETHToTokens',
            args: [
                toToken.addresses[fromChain.chainId],
                amountOutMin,
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

async function swapTokensToETH(
    fromChain: Chain,
    toChain: Chain,
    fromToken: Token,
    amountIn: bigint,
    amountOutMin: bigint
): Promise<`0x${string}` | null> {
    if (!fromToken.addresses[toChain.chainId]) return null;

    try {
        const result = await writeContract(config, {
            abi: honeyRouterAbi,
            address: honeyRouters[fromChain.chainId],
            functionName: 'swapTokensToETH',
            args: [
                fromToken.addresses[fromChain.chainId],
                amountIn,
                amountOutMin,
                toChain.equitoSelector
            ],
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
            address: honeyRouters[fromChain.chainId],
            functionName: 'swapTokensToTokens',
            args: [
                fromToken.addresses[fromChain.chainId],
                amountIn,
                toToken.addresses[fromChain.chainId],
                amountOutMin,
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
            address: honeyRouters[chain.chainId],
            functionName: 'getEquitoFee',
            chainId: chain.chainId
        });
    } catch (error) {
        console.log(error);
        return BigInt(0);
    }
}