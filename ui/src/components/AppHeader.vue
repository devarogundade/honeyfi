<script setup lang="ts">
import HoneyFiLogo from '@/components/icons/HoneyFiLogo.vue';
</script>

<template>
    <section>
        <div class="app_width">
            <header>
                <div class="header_info">
                    <RouterLink to="/">
                        <div class="logo">
                            <HoneyFiLogo />
                        </div>
                    </RouterLink>

                    <nav class="tabs">
                        <RouterLink to="/">
                            <button class="tab tab_active">Swap</button>
                        </RouterLink>
                        <RouterLink to="/faucet">
                            <button class="tab">Faucet</button>
                        </RouterLink>
                    </nav>
                </div>

                <div class="header_actions">
                    <button class="connect">Connect Wallet</button>
                </div>
            </header>
        </div>
    </section>
</template>

<style scoped>
section {
    position: sticky;
    top: 0;
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

.logo svg {
    margin-top: 6px;
    width: 120px;
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

    .logo svg {
        width: 80px;
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