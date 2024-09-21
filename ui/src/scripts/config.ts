import { bscTestnet, arbitrumSepolia } from '@wagmi/core/chains';
import { walletConnect } from '@wagmi/connectors';
import { defaultWagmiConfig } from '@web3modal/wagmi';

const metadata = {
    name: 'HoneyFi',
    description: 'Cross-chain swap aggregator.',
    url: 'https://honeyfi.netlify.app',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
};

export const chains = [bscTestnet, arbitrumSepolia];

export const config = defaultWagmiConfig({
    // @ts-ignore
    chains, projectId: import.meta.env.VITE_PROJECT_ID, metadata, connectors: [walletConnect({
        projectId: import.meta.env.VITE_PROJECT_ID
    })]
});