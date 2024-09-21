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
    }
];

export const popularChains: Chain[] = [
    chains[0], chains[1]
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