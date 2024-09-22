import { vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const MNEMONIC = vars.get("MNEMONIC");

const BSC_API_KEY = vars.get("BSC_API_KEY");
const ARBITRUM_API_KEY = vars.get("ARBITRUM_API_KEY");

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
      url: 'https://bsc-testnet.public.blastapi.io',
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
    }
  },
  etherscan: {
    apiKey: {
      bsc: BSC_API_KEY,
      arbitrum: ARBITRUM_API_KEY
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
        network: 'arbitrum',
        chainId: 421614,
        urls: {
          apiURL: 'https://api-sepolia.arbiscan.io/api',
          browserURL: 'https://sepolia.arbiscan.io/',
        },
      }
    ],
  },
};




