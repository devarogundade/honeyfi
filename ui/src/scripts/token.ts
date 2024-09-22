import type { Token } from "./types";

export const WETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export const tokens: Token[] = [
    {
        name: "Ethereum",
        symbol: "ETH",
        image: "/images/eth.png",
        addresses: {
            97: "0x3b67b9F3640e1c6103A4CD8c9Db415987444Ac00",
            421614: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        }
    },
    {
        name: "Binance",
        symbol: "BNB",
        image: "/images/bsc.png",
        addresses: {
            97: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            421614: "0xaAAb8EE63b5aad589d834261b1dbfac59d681c5D"
        }
    },
    {
        name: "HoneyFi Bitcoin",
        symbol: "hBTC",
        image: "/images/btc.png",
        addresses: {
            97: "0x8668a4845BAC981a78734Aa3164eFD88Ce614a97",
            421614: "0x3d269Ea3641fB768Ce7069BB9b73fccc880b9Da6"
        }
    },
    {
        name: "HoneyFi USDT",
        symbol: "hUSDT",
        image: "/images/usdt.png",
        addresses: {
            97: "0x58D772598C95cbf22C0219906d8F7C00630bd8C7",
            421614: "0xd331af3CB5894A90C328eF4F527a032b53a5D8bE"
        }
    }
];

export const popularTokens = (chainId: number): Token[] => {
    return tokens.filter((t) => t.addresses[chainId]?.startsWith(
        '0x'
    )).splice(1, 2);
};

export const getToken = (symbol: string): Token | undefined => {
    return tokens.find((t) => t.symbol.toLowerCase() == symbol.toLowerCase());
};

export const findChainTokens = (chainId: number): Token[] => {
    return tokens.filter((t) => t.addresses[chainId]?.startsWith(
        '0x'
    ));
};

export const findTokensByNameOrAddress = (value: string, chainId: number): Token[] => {
    if (value.length == 0) {
        return tokens.filter((t) => t.addresses[chainId]?.startsWith(
            '0x'
        ));
    }

    return tokens.filter((t) => t.name.replace(" ", "").toLowerCase().includes(
        value.replace(" ", "").toLowerCase()) ||
        t.addresses[chainId]?.toLowerCase() == value.toLowerCase()
    );
};