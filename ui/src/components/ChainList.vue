<script setup lang="ts">
import OutIcon from './icons/OutIcon.vue';
import SearchIcon from './icons/SearchIcon.vue';
import CloseIcon from './icons/CloseIcon.vue';
import { findChainsByName, popularChains } from '@/scripts/chains';
import { ref } from 'vue';

const emit = defineEmits(['close', 'onChainChanged']);

const searchValue = ref('');
</script>

<template>
    <div class="container">
        <div class="chain_box">
            <div class="chain_box_header">
                <h3>Select a Chain</h3>
                <CloseIcon @click="emit('close')" />
            </div>

            <div class="search">
                <div class="search_box">
                    <SearchIcon />
                    <input type="text" v-model="searchValue" placeholder="Search by chain name">
                </div>
            </div>

            <div class="popular_chains">
                <button class="popular_chain" v-for="chain in popularChains" :key="chain.chainId"
                    @click="emit('onChainChanged', chain)">
                    <img :src="chain.image" :alt="chain.name">
                    <p>{{ chain.shortName }}</p>
                </button>
            </div>

            <div class="chains">
                <div class="chain" v-for="chain in findChainsByName(searchValue)" :key="chain.chainId"
                    @click="emit('onChainChanged', chain)">
                    <div class="chain_info">
                        <img :src="chain.image" :alt="chain.name">
                        <div class="chain_name">
                            <p>{{ chain.name }}</p>
                            <p>{{ chain.shortName }}</p>
                        </div>
                    </div>

                    <div class="chain_amount">
                        <p class="chain_balance">--</p>
                        <a :href="chain.faucetLink" target="_blank">
                            <div class="chain_address">
                                <p>Faucet</p>
                                <OutIcon />
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(12px);
    z-index: 10;
}

.chain_box {
    background: var(--bg);
    width: 440px;
    border-radius: 16px;
    border: 1px solid var(--border);
    overflow: hidden;
}

.chain_box_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 20px;
}

.chain_box_header svg {
    width: 30px;
    height: 30px;
    cursor: pointer;
}

.chain_box_header h3 {
    font-size: 16px;
    font-weight: 600;
    color: var(--tx-normal);
}

.search {
    padding: 0 20px;
}

.search_box {
    padding: 0 10px;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 10px;
    border: 1px solid var(--border);
    border-radius: 12px;
}

.search_box input {
    height: 40px;
    background: none;
    border: none;
    outline: none;
    color: var(--tx-normal);
    font-size: 16px;
    font-weight: 500;
}

.popular_chains {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px 12px;
    padding: 16px 20px;
}

.popular_chain {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--bg);
    border-radius: 20px;
    border: 1px solid var(--border);
    padding: 4px;
    padding-right: 8px;
}

.popular_chain img {
    width: 24px;
    height: 24px;
    border-radius: 12px;
}

.popular_chain p {
    font-size: 14px;
    font-weight: 500;
    color: var(--tx-normal);
}

.chains {
    height: 420px;
    max-height: 50vh;
    overflow-y: auto;
}

.chain {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 65px;
    cursor: pointer;
}

.chain:hover {
    background: var(--bg-light);
}

.chain_info {
    display: flex;
    align-items: center;
    gap: 16px;
}

.chain_name p:first-child {
    font-size: 14px;
    font-weight: 500;
    color: var(--tx-normal);
}

.chain_name p:last-child {
    font-size: 12px;
    font-weight: 400;
    color: var(--tx-semi);
    margin-top: 2px;
}

.chain img {
    width: 24px;
    height: 24px;
    border-radius: 12px;
}

.chain_amount {
    text-align: right;
}

.chain_balance {
    font-size: 14px;
    font-weight: 500;
    color: var(--tx-normal);
}

.chain_address {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
}

.chain_address p {
    font-size: 12px;
    font-weight: 400;
    color: var(--tx-semi);
}

@media screen and (max-width: 800px) {
    .container {
        align-items: flex-end;
    }

    .chain_box {
        border-bottom: none;
        border-radius: 16px 16px 0 0;
    }

    .chains {
        max-height: 40vh;
    }
}
</style>