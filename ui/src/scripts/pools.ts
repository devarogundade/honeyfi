import type { Pool } from "./types";

export const pools: Pool[] = [
    // ============= BSC ============= //
    {
        chainId: 97,
        tokenAddress: '0x3b67b9F3640e1c6103A4CD8c9Db415987444Ac00',
        poolAddress: '0xCAaea60b9667a971c0E78eE8121c093906cAFF04',
    },
    {
        chainId: 97,
        tokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        poolAddress: '0xa242743085dBd8820EcEde64c39942d3e8a6fe34',
    },
    {
        chainId: 97,
        tokenAddress: '0x8668a4845BAC981a78734Aa3164eFD88Ce614a97',
        poolAddress: '0xADbc0aD48724DDe7df56Ee30be0e855Ad597498A',
    },
    {
        chainId: 97,
        tokenAddress: '0x58D772598C95cbf22C0219906d8F7C00630bd8C7',
        poolAddress: '0x6D56a1CEB9784328d0C8550acE2AE0fC1f82E66d'
    },

    // ============= ARBITRUM ============= //
    {
        chainId: 421614,
        tokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        poolAddress: '0xf18C2d7DD6373e001aE3a2e041cc74077fAEce05',
    },
    {
        chainId: 421614,
        tokenAddress: '0x14E0826c58f9C2a3a1B46b51F6d4705bCf0d6a22',
        poolAddress: '0x5517DCf6Dc767258BB75e28d220b1D8DF80Df99d',
    },
    {
        chainId: 421614,
        tokenAddress: '0x7925430C6968122d0968F28cfd3118318fD97319',
        poolAddress: '0x26F65583fD7B68a5467F5E96Ca4A3e93B5942E49',
    },
    {
        chainId: 421614,
        tokenAddress: '0xFD132250838394168dFC2Da524C5Ee612715c431',
        poolAddress: '0x105BE8DD7D4747EA186E647e813AFc495661Dc6c'
    }
];

export const getPool = (chainId: number, tokenAddress: `0x${string}`): Pool | undefined => {
    return pools.find((p) => p.chainId == chainId && tokenAddress.toLowerCase() == p.tokenAddress.toLowerCase());
};

export const getPools = (chainId: number): Pool[] => {
    return pools.filter((p) => p.chainId == chainId);
};