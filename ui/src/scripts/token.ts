import type { Token } from "./types";

export const WETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export const tokens: Token[] = [
    {
        name: "Ethereum",
        symbol: "ETH",
        image: "/images/eth.png",
        addresses: {
            421614: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        }
    },
    {
        name: "Binance",
        symbol: "BNB",
        image: "/images/bsc.png",
        addresses: {
            97: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
        }
    },
    {
        name: "HoneyFi Bitcoin",
        symbol: "hBTC",
        image: "/images/btc.png",
        addresses: {
            97: "0x",
            421614: "0xEc61052fDaaE48fDF494e76B618F8072EAeC4a2A"
        }
    },
    {
        name: "HoneyFi USDT",
        symbol: "hUSDT",
        image: "/images/usdt.png",
        addresses: {
            97: "0x",
            421614: "0xdDb3B931BD891740196385dff784849952f86508"
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