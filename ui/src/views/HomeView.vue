<script setup lang="ts">
import RefreshIcon from '@/components/icons/RefreshIcon.vue';
import FlipIcon from '@/components/icons/FlipIcon.vue';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue';
import OutIcon from '@/components/icons/OutIcon.vue';
import SortIcon from '@/components/icons/SortIcon.vue';
import TokenList from '@/components/TokenList.vue';
import ChainList from '@/components/ChainList.vue';
import { config, chains } from '@/scripts/config';
import { onMounted, ref, watch, computed } from 'vue';
import { notify } from '@/reactives/notify';
import { popularChains } from '@/scripts/chains';
import { getAllowance, getTokenBalance, approveTokens } from '@/scripts/erc20';
import { tokens } from '@/scripts/token';
import { getBestRouter, honeyRouters, swapTokens } from '@/scripts/swap';
import type { Chain, Token, Router } from '@/scripts/types';
import { useAddressStore } from '@/stores/address';
import { createWeb3Modal } from '@web3modal/wagmi/vue';
import { useWeb3Modal } from '@web3modal/wagmi/vue';
import { switchChain, watchAccount } from '@wagmi/core';
import Converter from '@/scripts/converter';

createWeb3Modal({
  wagmiConfig: config,
  projectId: import.meta.env.VITE_PROJECT_ID,
  // @ts-ignore
  chains: chains,
  enableAnalytics: true
});

const HUNDRED: number = 100;

const modal = useWeb3Modal();
const addressStore = useAddressStore();
const tokenListModal = ref(false);
const chainListModal = ref(false);
const replaceIndex = ref(0);
const activeChainIdReplaceIndex = ref(popularChains[0].chainId);

const swapping = ref<boolean>(false);
const approving = ref<boolean>(false);
const slippaging = ref<boolean>(false);

interface SwapInput {
  fromChain: Chain;
  toChain: Chain;
  amountIn: number | undefined,
  amountOutMin: number | undefined;
  fromToken: Token;
  toToken: Token;
  router: Router | undefined;
  balanceIn: number;
  balanceOut: number;
  approveIn: number;
  slippage: number;
}

const swapInput = ref<SwapInput>({
  fromChain: popularChains[0],
  toChain: popularChains[1],
  amountIn: undefined,
  amountOutMin: undefined,
  fromToken: tokens[3],
  toToken: tokens[3],
  router: undefined,
  balanceIn: 0,
  balanceOut: 0,
  approveIn: 0,
  slippage: 1
});

// ================= Contract Functions ================= //

const swap = async () => {
  if (!addressStore.address) {
    notify.push({
      title: 'Connect Wallet',
      description: 'Wallet connection is required.',
      category: 'error'
    });
    return;
  }

  if (!swapInput.value.amountIn || swapInput.value.amountIn == 0) {
    notify.push({
      title: 'Invalid amount in',
      description: 'Enter a valid amount to swap.',
      category: 'error'
    });
    return;
  };

  if (!swapInput.value.amountOutMin || swapInput.value.amountOutMin == 0) {
    notify.push({
      title: 'Invalid amount out',
      description: 'Please wait for estimated amount out.',
      category: 'error'
    });
    return;
  };

  if (swapInput.value.amountIn > (swapInput.value.balanceIn || 0)) {
    notify.push({
      title: 'Insufficient funds',
      description: 'Please carefully enter your actual balance.',
      category: 'error'
    });
    return;
  };

  if (swapping.value) {
    notify.push({
      title: 'Please wait',
      description: 'Swapping in progress.',
      category: 'error'
    });
    return;
  }

  swapping.value = true;
  const swapAmountOutMin = swapInput.value.amountOutMin * (
    (HUNDRED - swapInput.value.slippage) / HUNDRED
  );

  const txHash = await swapTokens(
    swapInput.value.fromChain,
    swapInput.value.toChain,
    swapInput.value.fromToken,
    swapInput.value.toToken,
    Converter.toWei(swapInput.value.amountIn),
    Converter.toWei(swapAmountOutMin)
  );

  if (txHash) {
    notify.push({
      title: 'Swap completed',
      description: 'Transaction was sent succesfully.',
      category: 'success',
      linkTitle: 'View Trx',
      linkUrl: `${swapInput.value.fromChain.explorerUrl}/tx/${txHash}`
    });

    swapInput.value.amountIn = undefined;
    swapInput.value.amountOutMin = undefined;

    updateBalances();
  } else {
    notify.push({
      title: 'Transaction failed',
      description: 'Try again later.',
      category: 'error'
    });
  }

  swapping.value = false;
};

const approve = async () => {
  if (!addressStore.address) {
    notify.push({
      title: 'Connect Wallet',
      description: 'Wallet connection is required.',
      category: 'error'
    });
    return;
  }

  if (!swapInput.value.amountIn || swapInput.value.amountIn == 0) {
    notify.push({
      title: 'Invalid amount in',
      description: 'Enter a valid amount to swap.',
      category: 'error'
    });
    return;
  };

  if (approving.value) {
    notify.push({
      title: 'Please wait',
      description: 'Approval in progress.',
      category: 'error'
    });
    return;
  }

  approving.value = true;

  const txHash = await approveTokens(
    swapInput.value.fromToken,
    swapInput.value.fromChain,
    honeyRouters[swapInput.value.fromChain.chainId],
    Converter.toWei(swapInput.value.amountIn)
  );

  if (txHash) {
    notify.push({
      title: 'Approval completed',
      description: 'Transaction was sent succesfully.',
      category: 'success',
      linkTitle: 'View Trx',
      linkUrl: `${swapInput.value.fromChain.explorerUrl}/tx/${txHash}`
    });

    updateApprovals();

    swap();
  } else {
    notify.push({
      title: 'Transaction failed',
      description: 'Try again later.',
      category: 'error'
    });
  }

  approving.value = false;
};

const flip = async () => {
  const tempFromChain = swapInput.value.fromChain;
  const tempFromToken = swapInput.value.fromToken;

  swapInput.value.fromChain = swapInput.value.toChain;
  swapInput.value.fromToken = swapInput.value.toToken;

  swapInput.value.toChain = tempFromChain;
  swapInput.value.toToken = tempFromToken;

  if (addressStore.address) {
    await switchChain(config, { chainId: swapInput.value.fromChain.chainId });
  }
};

// ================= UX Functions ================= //

const updateAmountOut = async () => {
  if (!swapInput.value.amountIn) {
    swapInput.value.amountOutMin = undefined;
    return;
  };

  const bestPrice = await getBestRouter(
    swapInput.value.fromChain,
    swapInput.value.fromToken,
    swapInput.value.toToken,
    Converter.toWei(swapInput.value.amountIn)
  );

  if (!bestPrice) return;

  swapInput.value.amountOutMin = Converter.fromWei(bestPrice.amountOut);
  swapInput.value.router = bestPrice.router;
};

const updateBalances = async () => {
  if (addressStore.address) {
    const balanceIn = await getTokenBalance(
      swapInput.value.fromToken,
      swapInput.value.fromChain,
      addressStore.address
    );

    const balanceOut = await getTokenBalance(
      swapInput.value.toToken,
      swapInput.value.toChain,
      addressStore.address
    );

    swapInput.value.balanceIn = Converter.fromWei(balanceIn);
    swapInput.value.balanceOut = Converter.fromWei(balanceOut);
  }
};

const updateApprovals = async () => {
  if (addressStore.address) {
    const allowance = await getAllowance(
      swapInput.value.fromToken,
      swapInput.value.fromChain,
      addressStore.address,
      honeyRouters[swapInput.value.fromChain.chainId]
    );

    swapInput.value.approveIn = Converter.fromWei(allowance);
  }
};

const refresh = () => {
  updateAmountOut();
  updateBalances();
  updateApprovals();

  notify.push({
    title: 'Refreshed!',
    description: 'Updating values and parameters.',
    category: 'success'
  });
};

// ================= Modal Functions ================= //

const openTokenListModal = (index: number, chainId: number) => {
  replaceIndex.value = index;
  activeChainIdReplaceIndex.value = chainId;
  tokenListModal.value = true;
};

const openChainListModal = (index: number) => {
  replaceIndex.value = index;
  chainListModal.value = true;
};

const tokenChanged = (token: Token) => {
  if (replaceIndex.value == 0) {
    swapInput.value.fromToken = token;
  } else {
    swapInput.value.toToken = token;
  }

  tokenListModal.value = false;
};

const chainChanged = async (chain: Chain) => {
  if (replaceIndex.value == 0) {
    swapInput.value.fromChain = chain;

    if (addressStore.address) {
      await switchChain(config, { chainId: chain.chainId });
    }
  } else {
    swapInput.value.toChain = chain;
  }

  chainListModal.value = false;
};

onMounted(() => {
  watchAccount(config, {
    onChange(account: any) {
      addressStore.setAddress(account.address);
    },
  });
});

watch(
  computed(() => swapInput.value.fromChain),
  () => {
    updateBalances();
    updateApprovals();
    updateAmountOut();
  }
);

watch(
  computed(() => swapInput.value.toChain),
  () => {
    updateBalances();
    updateApprovals();
    updateAmountOut();
  }
);

watch(
  computed(() => swapInput.value.fromToken),
  () => {
    updateBalances();
    updateApprovals();
    updateAmountOut();
  }
);

watch(
  computed(() => swapInput.value.toToken),
  () => {
    updateBalances();
    updateApprovals();
    updateAmountOut();
  }
);

watch(
  computed(() => swapInput.value.amountIn),
  () => {
    updateBalances();
    updateApprovals();
    updateAmountOut();
  }
);

watch(
  computed(() => addressStore.address),
  () => {
    updateBalances();
    updateApprovals();
    updateAmountOut();
  }
);
</script>

<template>
  <section>
    <div class="app_width">
      <div class="swap_view">
        <div class="swap_widget">
          <div class="swap_widget_title">
            <h3>Cross-chain <br> swap aggregator.</h3>
          </div>

          <div class="swap_tools">
            <button class="swap_refresh" @click="refresh">
              <RefreshIcon />
            </button>

            <button class="swap_slippage" @click="slippaging = !slippaging">
              <SortIcon />
              <p>{{ swapInput.slippage.toFixed(2) }}% slippage</p>

              <div class="swap_slippage_options" v-if="slippaging">
                <button class="swap_slippage_option" @click="swapInput.slippage = 0.5">0.5%</button>
                <button class="swap_slippage_option" @click="swapInput.slippage = 1">1%</button>
                <button class="swap_slippage_option" @click="swapInput.slippage = 5">5%</button>

                <input type="number" v-model="swapInput.slippage">
              </div>
            </button>
          </div>

          <div class="swap_box">
            <div class="swap_box_child">
              <div class="swap_from_header">
                <p>You pay</p>

                <button class="chain" @click="openChainListModal(0)">
                  <img :src="swapInput.fromChain.image" :alt="swapInput.fromChain.name">
                  <p>{{ swapInput.fromChain.shortName }}</p>
                  <ChevronDownIcon />
                </button>
              </div>

              <div class="swap_input">
                <input type="number" v-model="swapInput.amountIn" placeholder="0">

                <button class="token" @click="openTokenListModal(0, swapInput.fromChain.chainId)">
                  <img :src="swapInput.fromToken.image" :alt="swapInput.fromToken.name">
                  <p>{{ swapInput.fromToken.symbol }}</p>
                  <ChevronDownIcon />
                </button>
              </div>

              <div class="swap_price">
                <p>Bal: {{ Converter.toMoney(swapInput.balanceIn) }}</p>
              </div>
            </div>

            <div class="swap_flip">
              <button class="swap_flip_icon" @click="flip">
                <FlipIcon />
              </button>
            </div>

            <div class="swap_box_child">
              <div class="swap_from_header">
                <p>You receive</p>

                <button class="chain" @click="openChainListModal(1)">
                  <img :src="swapInput.toChain.image" :alt="swapInput.toChain.name">
                  <p>{{ swapInput.toChain.shortName }}</p>
                  <ChevronDownIcon />
                </button>
              </div>

              <div class="swap_input">
                <input type="number" :value="swapInput.amountOutMin" disabled placeholder="0">

                <button class="token" @click="openTokenListModal(1, swapInput.toChain.chainId)">
                  <img :src="swapInput.toToken.image" :alt="swapInput.toToken.name">
                  <p>{{ swapInput.toToken.symbol }}</p>
                  <ChevronDownIcon />
                </button>
              </div>

              <div class="swap_price">
                <p>Bal: {{ Converter.toMoney(swapInput.balanceOut) }}</p>
              </div>
            </div>

            <div class="swap_action">
              <button v-if="!addressStore.address" @click="modal.open()">Connect Wallet</button>

              <button v-else-if="addressStore.address && swapInput.approveIn < (swapInput.amountIn || 0)"
                @click="approve">{{
                  approving ? 'Approving..' : 'Approve ' }}</button>

              <button v-else @click="swap">{{ swapping ? 'Swapping..' : 'Swap' }}</button>
            </div>
          </div>

          <div class="swap_info" v-if="swapInput.router && swapInput.amountOutMin">
            <p>
              {{ Converter.toMoney(swapInput.amountIn) }} {{ swapInput.fromToken.symbol }} ≈
              {{ Converter.toMoney(swapInput.amountOutMin) }} {{ swapInput.toToken.symbol }}
            </p>

            <a :href="JSON.parse(swapInput.router.routerURI).url" target="_blank">
              <button class="swap_route">
                <img :src="JSON.parse(swapInput.router.routerURI).image" alt="">
                <p>{{ swapInput.router.name }}</p>
                <OutIcon />
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>

    <TokenList :chain-id="activeChainIdReplaceIndex" v-if="tokenListModal" @close="tokenListModal = false"
      @on-token-changed="tokenChanged" />
    <ChainList v-if="chainListModal" @on-chain-changed="chainChanged" @close="chainListModal = false" />
  </section>
</template>

<style scoped>
.swap_view {
  display: flex;
  justify-content: center;
  padding-top: 40px;
  padding-bottom: 80px;
}

.swap_widget {
  width: 420px;
  max-width: 100%;
}

.swap_widget_title h3 {
  text-align: center;
  font-size: 45px;
  font-weight: 500;
  color: var(--tx-normal);
}

.swap_tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 40px;
  margin-bottom: 10px;
}

.swap_refresh {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  border-radius: 20px;
  border: 1px solid var(--border);
}

.swap_refresh svg {
  width: 14px;
  height: 14px;
}

.swap_slippage {
  height: 26px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg);
  border-radius: 20px;
  border: 1px solid var(--border);
  padding: 4px 10px;
  position: relative;
}

.swap_slippage svg {
  width: 14px;
  height: 14px;
}

.swap_slippage p {
  font-size: 12px;
  font-weight: 500;
  color: var(--tx-normal);
}

.swap_slippage_options {
  position: absolute;
  padding: 16px;
  background: var(--bg);
  border-radius: 12px;
  z-index: 2;
  right: 0;
  top: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--border);
}

.swap_slippage_option {
  height: 30px;
  padding: 0 10px;
  border-radius: 8px;
  background: var(--bg-light);
  color: var(--tx-semi);
}

.swap_slippage_options input {
  border-radius: 8px;
  background: var(--bg-light);
  color: var(--tx-normal);
  border: 1px solid var(--border);
  outline: none;
  width: 45px;
  height: 30px;
  padding: 0 10px;
}

.swap_box_child {
  border: 1px solid var(--bg-light);
  background: var(--bg-light);
  border-radius: 16px;
  padding: 16px;
}

.swap_box_child:first-child:hover {
  border: 1px solid var(--border);
}

.swap_from_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.swap_from_header>p {
  font-size: 16px;
  font-weight: 500;
  color: var(--tx-normal);
}

.swap_input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0;
}

.swap_input input {
  font-size: 30px;
  background: none;
  border: none;
  outline: none;
  color: var(--tx-normal);
  width: 200px;
}

.swap_input input::placeholder {
  color: var(--tx-dimmed);
}

.swap_flip {
  width: 100%;
  height: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.swap_flip_icon {
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

.swap_price p {
  min-height: 16px;
  font-size: 12px;
  font-weight: 500;
  color: var(--tx-dimmed);
}

.swap_action {
  margin-top: 6px;
}

.swap_action button {
  width: 100%;
  color: var(--primary-light);
  font-size: 18px;
  font-weight: 500;
  padding: 16px 14px;
  border-radius: 16px;
  background: var(--primary);
  cursor: pointer;
}

.swap_info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
}

.swap_info>p {
  font-size: 14px;
  font-weight: 500;
  color: var(--tx-dimmed);
}

.swap_route {
  display: flex;
  align-items: center;
  gap: 6px;
}

.swap_route img {
  width: 20px;
  height: 20px;
  border-radius: 10px;
}

.swap_route p {
  font-size: 14px;
  font-weight: 500;
  color: var(--tx-normal);
}

@media screen and (max-width: 800px) {
  .swap_view {
    padding-top: 36px;
    padding-bottom: 100px;
  }

  .swap_widget_title h3 {
    font-size: 36px;
  }
}
</style>