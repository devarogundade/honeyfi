import type { Token } from "./types";

export const tokens: Token[] = [
    {
        name: "HoneyFi Bitcoin",
        symbol: "hBTC",
        image: "/images/btc.png",
        addresses: {
            97: "0x",
            421614: "0x",
            43113: "0x",
            534351: "0x"
        }
    },
    {
        name: "HoneyFi USDT",
        symbol: "hUSDT",
        image: "/images/usdt.png",
        addresses: {
            97: "0x",
            421614: "0x",
            43113: "0x",
            534351: "0x"
        }
    }
];

export const popularTokens = (chainId: number): Token[] => {
    return tokens.filter((t) => t.addresses[chainId]?.startsWith(
        '0x'
    ));
};

export const getToken = (symbol: string): Token | undefined => {
    return tokens.find((t) => t.symbol.toLowerCase() == symbol.toLowerCase());
};

export const findTokensByNameOrAddress = (value: string, chainId: number): Token[] => {
    if (value.length == 0) {
        return tokens.filter((t) => t.addresses[chainId]?.startsWith(
            '0x'
        ));
    }

    return tokens.filter((t) => t.name.replace(" ", "").toLowerCase().includes(
        value.replace(" ", "").toLowerCase()) &&
        t.addresses[chainId].toLowerCase() == value.toLowerCase()
    );
};