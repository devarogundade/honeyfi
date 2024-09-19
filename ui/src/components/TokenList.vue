<script setup lang="ts">
import OutIcon from './icons/OutIcon.vue';
import CloseIcon from './icons/CloseIcon.vue';
import SearchIcon from './icons/SearchIcon.vue';
import { popularTokens, findTokensByNameOrAddress } from '@/scripts/token';
import { getChain } from '@/scripts/chains';
import { ref } from 'vue';

const emit = defineEmits(['close', 'onTokenChanged']);
const props = defineProps({
    chainId: { type: Number, required: true }
});

const searchValue = ref('');
</script>

<template>
    <div class="container">
        <div class="token_box">
            <div class="token_box_header">
                <h3>Select a Token for {{ getChain(props.chainId)?.name }}</h3>
                <CloseIcon @click="emit('close')" />
            </div>

            <div class="search">
                <div class="search_box">
                    <SearchIcon />
                    <input type="text" v-model="searchValue" placeholder="Search by token name or address">
                </div>
            </div>

            <div class="popular_tokens">
                <button class="popular_token" v-for="token, index in popularTokens(props.chainId)" :key="index"
                    @click="emit('onTokenChanged', token)">
                    <img :src="token.image" :alt="token.name">
                    <p>{{ token.symbol }}</p>
                </button>
            </div>

            <div class="tokens">
                <div class="token" v-for="token, index in findTokensByNameOrAddress(searchValue, props.chainId)"
                    :key="index" @click="emit('onTokenChanged', token)">
                    <div class="token_info">
                        <img :src="token.image" :alt="token.name">
                        <div class="token_name">
                            <p>{{ token.name }}</p>
                            <p>{{ token.symbol }}</p>
                        </div>
                    </div>

                    <div class="token_amount">
                        <p class="token_balance">--</p>
                        <a :href="`${token.addresses[props.chainId]}`" target="_blank">
                            <div class="token_address">
                                <p>0x123...4567</p>
                                <OutIcon />
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            <div class="info">
                <p>Default list may not include all tokens.</p>
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

.token_box {
    background: var(--bg);
    width: 440px;
    border-radius: 16px;
    border: 1px solid var(--border);
    overflow: hidden;
}

.token_box_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 20px;
}

.token_box_header svg {
    width: 30px;
    height: 30px;
    cursor: pointer;
}

.token_box_header h3 {
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

.popular_tokens {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px 12px;
    padding: 16px 20px;
}

.popular_token {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--bg);
    border-radius: 20px;
    border: 1px solid var(--border);
    padding: 4px;
    padding-right: 8px;
}

.popular_token img {
    width: 24px;
    height: 24px;
    border-radius: 12px;
}

.popular_token p {
    font-size: 14px;
    font-weight: 500;
    color: var(--tx-normal);
}

.tokens {
    height: 420px;
    max-height: 50vh;
    overflow-y: auto;
}

.token {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 65px;
    cursor: pointer;
}

.token:hover {
    background: var(--bg-light);
}

.token_info {
    display: flex;
    align-items: center;
    gap: 16px;
}

.token_name p:first-child {
    font-size: 14px;
    font-weight: 500;
    color: var(--tx-normal);
}

.token_name p:last-child {
    font-size: 12px;
    font-weight: 400;
    color: var(--tx-semi);
    margin-top: 2px;
}

.token img {
    width: 24px;
    height: 24px;
    border-radius: 12px;
}

.token_amount {
    text-align: right;
}

.token_balance {
    font-size: 14px;
    font-weight: 500;
    color: var(--tx-normal);
}

.token_address {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
}

.token_address p {
    font-size: 12px;
    font-weight: 400;
    color: var(--tx-semi);
}

.info {
    padding: 20px 20px 30px 20px;
}

.info p {
    color: var(--tx-dimmed);
    font-size: 12px;
    text-align: center;
}

@media screen and (max-width: 800px) {
    .container {
        align-items: flex-end;
    }

    .token_box {
        border-bottom: none;
        border-radius: 16px 16px 0 0;
    }

    .tokens {
        max-height: 40vh;
    }
}
</style>