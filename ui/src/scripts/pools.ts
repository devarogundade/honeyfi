import type { Pool } from "./types";

export const pools: Pool[] = [
    // ============= BSC ============= //
    {
        chainId: 97,
        tokenAddress: '0x59a69f13E48e9B79650455c539bf5BB972d1eBF7',
        poolAddress: '0x377c926a4c49d3df86aE901258Ae2B974e6D1bD0',
    },
    {
        chainId: 97,
        tokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        poolAddress: '0x52f4cBCb8Ec149D00108a28bb51108C212D1CFD4',
    },
    {
        chainId: 97,
        tokenAddress: '0xE485cdD587BFfc8995B1E0A353c1BD49Fcc36003',
        poolAddress: '0x14812AECFaAcBfA5641818C5d675D217107C0b54',
    },
    {
        chainId: 97,
        tokenAddress: '0xaC19C35bB435AAABaa8478Ee6b70dceeC1BE164d',
        poolAddress: '0xB51De1De6645Ad70E68948be187a99dad878f71a'
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