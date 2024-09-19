<script setup lang="ts">
import { config, chains } from '@/scripts/config';
import Converter from '@/scripts/converter';
import { onMounted } from 'vue';
import { useAddressStore } from '@/stores/address';
import { createWeb3Modal } from '@web3modal/wagmi/vue';
import { useWeb3Modal } from '@web3modal/wagmi/vue';
import { watchAccount } from '@wagmi/core';
import { useRoute } from 'vue-router';

createWeb3Modal({
    wagmiConfig: config,
    projectId: import.meta.env.VITE_PROJECT_ID,
    // @ts-ignore
    chains: chains,
    enableAnalytics: true
});

const modal = useWeb3Modal();
const addressStore = useAddressStore();
const route = useRoute();

onMounted(() => {
    watchAccount(config, {
        onChange(account: any) {
            addressStore.setAddress(account.address);
        },
    });
});
</script>

<template>
    <section>
        <div class="app_width">
            <header>
                <div class="header_info">
                    <RouterLink to="/">
                        <div class="logo">
                            <img src="/images/logo.png" alt="">
                        </div>
                    </RouterLink>

                    <nav class="tabs">
                        <RouterLink to="/">
                            <button :class="route.name == 'swap' ? 'tab tab_active' : 'tab'">Swap</button>
                        </RouterLink>
                        <RouterLink to="/pools">
                            <button :class="route.name == 'pools' ? 'tab tab_active' : 'tab'">Earn</button>
                        </RouterLink>
                    </nav>
                </div>

                <div class="header_actions">
                    <button class="connect" @click="modal.open()">
                        {{ addressStore.address ? `${Converter.fineHash(addressStore.address, 4)}` :
                            'Connect Wallet'
                        }}
                    </button>
                </div>
            </header>
        </div>
    </section>
</template>

<style scoped>
section {
    position: sticky;
    top: 0;
    z-index: 100;
}

header {
    height: 74px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.header_info {
    display: flex;
    align-items: center;
    gap: 40px;
}

.logo {
    width: 50px;
}

.logo img {
    width: 100%;
}

.tabs {
    display: flex;
    align-items: center;
    gap: 10px;
}

.tab {
    color: var(--tx-dimmed);
    font-size: 16px;
    font-weight: 500;
    padding: 8px 16px;
    border-radius: 12px;
    background: none;
    cursor: pointer;
}

.tab:hover {
    background: var(--bg-light);
}

.tab_active {
    color: var(--tx-normal);
}

.connect {
    color: var(--primary-light);
    font-size: 14px;
    font-weight: 500;
    padding: 10px 14px;
    border-radius: 20px;
    background: var(--primary);
    cursor: pointer;
}

@media screen and (max-width: 800px) {
    header {
        height: 60px;
    }

    .logo {
        width: 40px;
    }

    .tabs {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .header_info {
        gap: 10px;
    }

    .tabs {
        gap: 4px;
    }

    .tab {
        font-size: 14px;
        padding: 4px 8px;
    }

    .connect {
        font-size: 12px;
        padding: 8px 10px;
    }
}
</style>