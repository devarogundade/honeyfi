import type { Pool } from "./types";

export const pools: Pool[] = [
    // ============= BSC ============= //
    {
        chainId: 97,
        tokenAddress: '0x',
        poolAddress: '0x',
    },
    {
        chainId: 97,
        tokenAddress: '0x',
        poolAddress: '0x',
    },
    {
        chainId: 97,
        tokenAddress: '0x',
        poolAddress: '0x'
    },

    // ============= ARBITRUM ============= //
    {
        chainId: 421614,
        tokenAddress: '0x',
        poolAddress: '0x',
    },
    {
        chainId: 421614,
        tokenAddress: '0x',
        poolAddress: '0x',
    },
    {
        chainId: 421614,
        tokenAddress: '0x',
        poolAddress: '0x'
    }
];

export const getPool = (chainId: number, tokenAddress: `0x${string}`): Pool | undefined => {
    return pools.find((p) => p.chainId == chainId && tokenAddress.toLowerCase() == p.tokenAddress.toLowerCase());
};

export const getPools = (chainId: number): Pool[] => {
    return pools.filter((p) => p.chainId == chainId);
};