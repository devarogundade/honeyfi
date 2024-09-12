import { vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const MNEMONIC = vars.get("MNEMONIC");
// const BSC_API_KEY = vars.get("BSC_API_KEY");
// const ARBITRUM_API_KEY = vars.get("ARBITRUM_API_KEY");
// const AVALANCHE_API_KEY = vars.get("AVALANCHE_API_KEY");
// const SCROLL_API_KEY = vars.get("SCROLL_API_KEY");

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
      viaIR: true
    },
  },
  networks: {
    bsc: {
      url: 'wss://bsc-testnet-rpc.publicnode.com',
      chainId: 97,
      accounts: {
        mnemonic: MNEMONIC
      },
    },
    arbitrum: {
      url: 'https://arbitrum-sepolia.blockpi.network/v1/rpc/public',
      chainId: 421614,
      accounts: {
        mnemonic: MNEMONIC
      },
    },
    avalanche: {
      url: 'https://avax-pokt.nodies.app/ext/bc/C/rpc',
      chainId: 43113,
      accounts: {
        mnemonic: MNEMONIC
      },
    },
    scroll: {
      url: 'https://scroll-public.scroll-testnet.quiknode.pro',
      chainId: 534351,
      accounts: {
        mnemonic: MNEMONIC
      },
    }
  },
  etherscan: {
    apiKey: {
      // bsc: BSC_API_KEY,
      // arbitrum: ARBITRUM_API_KEY,
      // avalanche: AVALANCHE_API_KEY,
      // scroll: SCROLL_API_KEY
    },
    customChains: [
      {
        network: 'bsc',
        chainId: 97,
        urls: {
          apiURL: 'https://api-testnet.bscscan.com/api',
          browserURL: 'https://testnet.bscscan.com/',
        },
      },
      {
        network: 'polygon',
        chainId: 80002,
        urls: {
          apiURL: 'https://api-amoy.polygonscan.com/api',
          browserURL: 'https://amoy.polygonscan.com/',
        },
      },
      {
        network: 'arbitrum',
        chainId: 421614,
        urls: {
          apiURL: 'https://api-sepolia.arbiscan.io/api',
          browserURL: 'https://sepolia.arbiscan.io/',
        },
      },
      {
        network: 'avalanche',
        chainId: 43113,
        urls: {
          apiURL: 'https://api.routescan.io/v2/network/testnet/evm/43113/etherscan/api',
          browserURL: 'https://testnet.snowtrace.io/',
        },
      },
      {
        network: 'scroll',
        chainId: 534351,
        urls: {
          apiURL: 'https://api-sepolia.scrollscan.com/api',
          browserURL: 'https://sepolia.scrollscan.com/',
        },
      }
    ],
  },
};




