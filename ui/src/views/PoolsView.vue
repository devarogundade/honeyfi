<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { popularChains } from '@/scripts/chains';
import ChainList from '@/components/ChainList.vue';
import TokenList from '@/components/TokenList.vue';
import type { Chain, Token, Router } from '@/scripts/types';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue';
import { config, chains } from '@/scripts/config';
import { findChainTokens } from '@/scripts/token';
import { useAddressStore } from '@/stores/address';
import { createWeb3Modal } from '@web3modal/wagmi/vue';
import { useWeb3Modal } from '@web3modal/wagmi/vue';
import { watchAccount } from '@wagmi/core';

createWeb3Modal({
  wagmiConfig: config,
  projectId: import.meta.env.VITE_PROJECT_ID,
  // @ts-ignore
  chains: chains,
  enableAnalytics: true
});

enum Mode {
  DEPOSIT,
  WITHDRAW
}

const modal = useWeb3Modal();
const addressStore = useAddressStore();
const tokenListModal = ref(false);
const chainListModal = ref(false);

const openChainListModal = () => {
  chainListModal.value = true;
};

const openTokenListModal = () => {
  tokenListModal.value = true;
};

const tokenChanged = (token: Token) => {
  poolsInput.value.token = token;

  tokenListModal.value = false;
};

const chainChanged = (chain: Chain) => {
  poolsInput.value.chain = chain;
  poolsInput.value.token = findChainTokens(chain.chainId)[0];

  chainListModal.value = false;
};

const poolsInput = ref({
  chain: popularChains[0],
  token: findChainTokens(popularChains[0].chainId)[0],
  mode: Mode.DEPOSIT
});

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
      <div class="pools_view">
        <div class="pools_title">
          <h3>Earn by providing liquidity</h3>

          <button class="pools_title_chain" @click="openChainListModal()">
            <img :src="poolsInput.chain.image" :alt="poolsInput.chain.name">
            <p>{{ poolsInput.chain.shortName }}</p>
            <ChevronDownIcon />
          </button>
        </div>

        <div class="pools_grid">
          <div class="pools">
            <div class="pool" v-for="token, index in findChainTokens(poolsInput.chain.chainId)" :key="index">
              <div class="pool_info">
                <img :src="token.image" :alt="token.name">
                <p>{{ token.name }}</p>
                <span>{{ token.symbol }}</span>
              </div>

              <div class="position">
                <p>My Position</p>
                <h3>0.00 {{ token.symbol }}</h3>
              </div>

              <div class="position">
                <p>Liquidty</p>
                <h3>120.48 {{ token.symbol }}</h3>
              </div>
            </div>
          </div>

          <div class="liquidity_widget">
            <div class="tabs">
              <button :class="poolsInput.mode == Mode.DEPOSIT ? 'tab tab_active' : 'tab'"
                @click="poolsInput.mode = Mode.DEPOSIT">Add</button>

              <button :class="poolsInput.mode == Mode.WITHDRAW ? 'tab tab_active' : 'tab'"
                @click="poolsInput.mode = Mode.WITHDRAW">Remove</button>
            </div>

            <div class="liquidity_box">
              <div class="liquidity_box_child">
                <div class="liquidity_from_header">
                  <p>You {{ poolsInput.mode == Mode.DEPOSIT ? 'deposit' : 'withdraw' }}</p>

                  <button class="chain" @click="openChainListModal()">
                    <img :src="poolsInput.chain.image" :alt="poolsInput.chain.name">
                    <p>{{ poolsInput.chain.shortName }}</p>
                    <ChevronDownIcon />
                  </button>
                </div>

                <div class="liquidity_input">
                  <input type="number" placeholder="0">

                  <button class="token" @click="openTokenListModal()">
                    <img :src="poolsInput.token.image" :alt="poolsInput.token.name">
                    <p>{{ poolsInput.token.symbol }}</p>
                    <ChevronDownIcon />
                  </button>
                </div>

                <div class="liquidity_price">
                  <p>$1.03</p>
                </div>
              </div>

              <div class="liquidity_action">
                <button @click="modal.open()">Connect Wallet</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TokenList :chain-id="poolsInput.chain.chainId" v-if="tokenListModal" @close="tokenListModal = false"
      @on-token-changed="tokenChanged" />
    <ChainList v-if="chainListModal" @on-chain-changed="chainChanged" @close="chainListModal = false" />
  </section>
</template>

<style scoped>
.pools_title {
  display: flex;
  align-items: center;
  gap: 20px;
}

.pools_view {
  padding: 40px 0;
}

.pools_title h3 {
  text-align: center;
  font-size: 45px;
  font-weight: 500;
  color: var(--tx-normal);
}

.pools_title_chain {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pools_title_chain img {
  width: 24px;
  height: 24px;
  border-radius: 12px;
}

.pools_title_chain p {
  font-size: 18px;
  font-weight: 500;
  color: var(--tx-semi);
}

.pools_title_chain svg {
  width: 20px;
  height: 20px;
}

.pools_grid {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  gap: 40px;
}

.pools {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pool {
  padding: 20px;
  border-radius: 16px;
  background: var(--bg-light);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  width: 800px;
  border: 1px solid transparent;
  max-width: 100%;
  cursor: pointer;
}

.pool:hover {
  border: 1px solid var(--border);
}

.pool_info {
  border-right: 1px solid var(--border);
}

.pool_info img {
  width: 40px;
  height: 40px;
  border-radius: 20px;
}

.pool_info p {
  font-size: 14px;
  font-weight: 500;
  color: var(--tx-normal);
  margin-top: 10px;
}

.pool_info span {
  font-size: 12px;
  font-weight: 500;
  color: var(--tx-semi);
  margin-top: 4px;
}

.position {
  padding: 0 20px;
}

.position p {
  font-size: 14px;
  font-weight: 500;
  color: var(--tx-dimmed);
}

.position h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--tx-semi);
  margin-top: 20px;
}

.position:nth-child(2) {
  border-right: 1px solid var(--border);
}

.tabs {
  display: flex;
  align-items: center;
  background: var(--bg-light);
  border-radius: 12px;
  overflow: hidden;
  width: fit-content;
  margin-bottom: 10px;
  padding: 2px;
}

.tab {
  padding: 0 20px;
  height: 40px;
  font-size: 14px;
  font-weight: 500;
  color: var(--tx-dimmed);
  border-radius: 10px;
}

.tab_active {
  color: var(--tx-normal);
  border: 1px solid var(--border);
}

.liquidity_box {
  width: 420px;
  max-width: 100%;
}

.liquidity_box_child {
  border: 1px solid var(--bg-light);
  background: var(--bg-light);
  border-radius: 16px;
  padding: 16px;
}

.liquidity_box_child:first-child:hover {
  border: 1px solid var(--border);
}

.liquidity_from_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.liquidity_from_header>p {
  font-size: 16px;
  font-weight: 500;
  color: var(--tx-normal);
}

.liquidity_input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0;
}

.liquidity_input input {
  font-size: 30px;
  background: none;
  border: none;
  outline: none;
  color: var(--tx-normal);
  width: 200px;
}

.liquidity_input input::placeholder {
  color: var(--tx-dimmed);
}

.liquidity_flip {
  width: 100%;
  height: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.liquidity_flip_icon {
  position: absolute;
  width: 45px;
  height: 45px;
  border: 3px solid var(--bg);
  background: var(--bg-light);
  border-radius: 25px;
}

.chain {
  display: flex;
  align-items: center;
  gap: 6px;
}

.chain img {
  width: 16px;
  height: 16px;
  border-radius: 12px;
}

.chain p {
  font-size: 14px;
  font-weight: 500;
  color: var(--tx-semi);
}

.token {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg);
  border-radius: 20px;
  border: 1px solid var(--border);
  padding: 4px;
  padding-right: 6px;
}

.token img {
  width: 24px;
  height: 24px;
  border-radius: 12px;
}

.token p {
  font-size: 14px;
  font-weight: 500;
  color: var(--tx-normal);
}

.liquidity_price p {
  min-height: 16px;
  font-size: 12px;
  font-weight: 500;
  color: var(--tx-dimmed);
}

.liquidity_action {
  margin-top: 6px;
}

.liquidity_action button {
  width: 100%;
  color: var(--primary-light);
  font-size: 18px;
  font-weight: 500;
  padding: 16px 14px;
  border-radius: 16px;
  background: var(--primary);
  cursor: pointer;
}
</style>
