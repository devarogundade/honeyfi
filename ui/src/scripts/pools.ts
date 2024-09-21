import type { Pool } from "./types";

export const pools: Pool[] = [
    {
        chainId: 421614,
        tokenAddress: '0x',
        poolAddress: '0x',
        isETHPool: true
    }
];

export const getPool = (chainId: number, tokenAddress: `0x${string}`): Pool | undefined => {
    return pools.find((p) => p.chainId == chainId && tokenAddress.toLowerCase() == p.tokenAddress.toLowerCase());
};

export const getPools = (chainId: number): Pool[] => {
    return pools.filter((p) => p.chainId == chainId);
};