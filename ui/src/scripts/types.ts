export type Chain = {
    name: string;
    image: string;
    shortName: string;
    chainId: number;
    explorerUrl: string;
    equitoSelector: number;
    faucetLink: string;
};

export type Token = {
    name: string;
    symbol: string;
    image: string;
    addresses: { [key: number]: `0x${string}` | undefined; };
};

export type Pool = {
    chainId: number;
    tokenAddress: `0x${string}`;
    poolAddress: `0x${string}`;
};

export type Router = {
    name: string;
    routerURI: string;
};

export interface Notification {
    title: string;
    description: string;
    category: string;
    linkTitle?: string;
    linkUrl?: string;
}