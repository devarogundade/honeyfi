import type { Pool } from "./types";

export const pools: Pool[] = [
    // ============= BSC ============= //
    {
        chainId: 97,
        tokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
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
        tokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        poolAddress: '0x9C79Dc9047250d6043b4e32C0B3C882217445930',
    },
    {
        chainId: 421614,
        tokenAddress: '0xaAAb8EE63b5aad589d834261b1dbfac59d681c5D',
        poolAddress: '0xA1264F93EB785330502CA5B6c6be492a04Faf6Ba',
    },
    {
        chainId: 421614,
        tokenAddress: '0x3d269Ea3641fB768Ce7069BB9b73fccc880b9Da6',
        poolAddress: '0x4EbBd8061c03bf146f7333F228676a94861f906b',
    },
    {
        chainId: 421614,
        tokenAddress: '0xd331af3CB5894A90C328eF4F527a032b53a5D8bE',
        poolAddress: '0x95b319801de790C4eeb19FC8721ff1db30fA80eF'
    }
];

export const getPool = (chainId: number, tokenAddress: `0x${string}`): Pool | undefined => {
    return pools.find((p) => p.chainId == chainId && tokenAddress.toLowerCase() == p.tokenAddress.toLowerCase());
};

export const getPools = (chainId: number): Pool[] => {
    return pools.filter((p) => p.chainId == chainId);
};