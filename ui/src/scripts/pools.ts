import type { Pool } from "./types";

export const pools: Pool[] = [
    {
        chainId: 534351,
        tokenAddress: '0x1AB5Cf372b81b57675ABbebD61878eFfCA290092',
        poolAddress: '0xDB554ae05b1e340c67DA2AE195D333f87a08a530',
        isETHPool: false
    },
    {
        chainId: 534351,
        tokenAddress: '0x744cDC1c538aDD90B31F8aEaA2eb22622d2C34bf',
        poolAddress: '0x39A54eE4c8666bE959861f5e75bC0B6D383CCd48',
        isETHPool: false
    }
];

export const getPool = (chainId: number, tokenAddress: `0x${string}`): Pool | undefined => {
    return pools.find((p) => p.chainId == chainId && tokenAddress.toLowerCase() == p.tokenAddress.toLowerCase());
};

export const getPools = (chainId: number): Pool[] => {
    return pools.filter((p) => p.chainId == chainId);
};