import type { Chain } from "./types";

export const chains: Chain[] = [
    {
        name: "Bsc Testnet",
        image: "/images/bsc.png",
        shortName: "BSC",
        chainId: 97,
        explorerUrl: '',
        equitoSelector: 1002,
        faucetLink: ''
    },
    {
        name: "Arbitrum Sepolia",
        image: "/images/arb.png",
        shortName: "Arb",
        chainId: 421614,
        explorerUrl: '',
        equitoSelector: 1004,
        faucetLink: ''
    },
    {
        name: "Avalanche Fuji",
        image: "/images/avax.png",
        shortName: "Avax",
        chainId: 43113,
        explorerUrl: '',
        equitoSelector: 1005,
        faucetLink: ''
    },
    {
        name: "Scroll Sepolia",
        image: "/images/scroll.png",
        shortName: "Scroll",
        chainId: 534351,
        explorerUrl: '',
        equitoSelector: 1020,
        faucetLink: ''
    }
];

export const popularChains: Chain[] = [
    chains[0], chains[2]
];

export const getChain = (chainId: number): Chain | undefined => {
    return chains.find((c) => c.chainId == chainId);
};

export const findChainsByName = (value: string): Chain[] => {
    if (value.length == 0) return chains;
    return chains.filter((c) => c.name.replace(" ", "").toLowerCase().includes(
        value.replace(" ", "").toLowerCase()
    ));
};