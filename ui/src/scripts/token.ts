import type { Token } from "./types";

export const WETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export const tokens: Token[] = [
    {
        name: "Ethereum",
        symbol: "ETH",
        image: "/images/eth.png",
        addresses: {
            97: "0x59a69f13E48e9B79650455c539bf5BB972d1eBF7",
            421614: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        }
    },
    {
        name: "Binance",
        symbol: "BNB",
        image: "/images/bsc.png",
        addresses: {
            97: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            421614: "0x14E0826c58f9C2a3a1B46b51F6d4705bCf0d6a22"
        }
    },
    {
        name: "HoneyFi Bitcoin",
        symbol: "hBTC",
        image: "/images/btc.png",
        addresses: {
            97: "0xE485cdD587BFfc8995B1E0A353c1BD49Fcc36003",
            421614: "0x7925430C6968122d0968F28cfd3118318fD97319"
        }
    },
    {
        name: "HoneyFi USDT",
        symbol: "hUSDT",
        image: "/images/usdt.png",
        addresses: {
            97: "0xaC19C35bB435AAABaa8478Ee6b70dceeC1BE164d",
            421614: "0xFD132250838394168dFC2Da524C5Ee612715c431"
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