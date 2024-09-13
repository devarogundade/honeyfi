export type Chain = {
    name: string;
    image: string;
    shortName: string;
    chainId: number;
    equitoSelector: number;
    faucetLink: string;
};

export type Token = {
    name: string;
    symbol: string;
    image: string;
    addresses: { [key: number]: string; };
};

export type Router = {
    name: string;
    image: string;
    website: string;
};