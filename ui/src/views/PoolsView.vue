<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { popularChains } from '@/scripts/chains';
import ChainList from '@/components/ChainList.vue';
import TokenList from '@/components/TokenList.vue';
import type { Chain, Token } from '@/scripts/types';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue';
import { config, chains } from '@/scripts/config';
import { findChainTokens } from '@/scripts/token';
import { useAddressStore } from '@/stores/address';
import { createWeb3Modal } from '@web3modal/wagmi/vue';
import { useWeb3Modal } from '@web3modal/wagmi/vue';
import { switchChain, watchAccount } from '@wagmi/core';
import Converter from '@/scripts/converter';
import { approveTokens, approveLPTokens, getAllowance, getLPTokenBalance, getLPAllowance, getTokenBalance } from '@/scripts/erc20';
import { getPool } from '@/scripts/pools';
import { notify } from '@/reactives/notify';
import { addLiquidity, removeLiquidity } from '@/scripts/liquidity';

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

const depositing = ref<boolean>(false);
const withdrawing = ref<boolean>(false);
const approving = ref<boolean>(false);

const poolsInput = ref({
  chain: popularChains[0],
  secondaryChain: popularChains[1],
  token: findChainTokens(popularChains[0].chainId)[0],
  mode: Mode.DEPOSIT,
  amount: undefined as number | undefined,
  lpTokens: 0,
  balance: 0,
  approve: 0
});

// ================= Contract Functions ================= //

const deposit = async () => {
  if (depositing.value) return;

  if (!addressStore.address) {
    notify.push({
      title: 'Connect Wallet',
      description: 'Wallet connection is required.',
      category: 'error'
    });
    return;
  }

  const tokenAddress = poolsInput.value.token.addresses[poolsInput.value.chain.chainId];

  if (!tokenAddress) {
    notify.push({
      title: 'Invalid token',
      description: 'Token not found.',
      category: 'error'
    });
    return;
  }

  const pool = getPool(
    poolsInput.value.chain.chainId,
    tokenAddress
  );

  if (!pool) {
    notify.push({
      title: 'Invalid ppol',
      description: 'Pool not found.',
      category: 'error'
    });
    return;
  }

  if (!poolsInput.value.amount || poolsInput.value.amount == 0) {
    notify.push({
      title: 'Invalid amount in',
      description: 'Enter a valid amount to deposit.',
      category: 'error'
    });
    return;
  };

  depositing.value = true;

  const txHash = await addLiquidity(
    pool,
    poolsInput.value.chain,
    Converter.toWei(poolsInput.value.amount)
  );

  if (txHash) {
    notify.push({
      title: 'Deposit liquidity completed',
      description: 'Transaction was sent succesfully.',
      category: 'success',
      linkTitle: 'View Trx',
      linkUrl: `${poolsInput.value.chain.explorerUrl}/tx/${txHash}`
    });

    poolsInput.value.amount = undefined;

    updateBalances();
  } else {
    notify.push({
      title: 'Transaction failed',
      description: 'Try again later.',
      category: 'error'
    });
  }

  depositing.value = false;
};

const withdraw = async () => {
  if (withdrawing.value) return;

  if (!addressStore.address) {
    notify.push({
      title: 'Connect Wallet',
      description: 'Wallet connection is required.',
      category: 'error'
    });
    return;
  }

  const tokenAddress = poolsInput.value.token.addresses[poolsInput.value.chain.chainId];

  if (!tokenAddress) {
    notify.push({
      title: 'Invalid token',
      description: 'Token not found.',
      category: 'error'
    });
    return;
  }

  const pool = getPool(
    poolsInput.value.chain.chainId,
    tokenAddress
  );

  if (!pool) {
    notify.push({
      title: 'Invalid ppol',
      description: 'Pool not found.',
      category: 'error'
    });
    return;
  }

  if (!poolsInput.value.amount || poolsInput.value.amount == 0) {
    notify.push({
      title: 'Invalid amount in',
      description: 'Enter a valid amount to deposit.',
      category: 'error'
    });
    return;
  };

  withdrawing.value = true;

  const txHash = await removeLiquidity(
    pool,
    poolsInput.value.chain,
    poolsInput.value.secondaryChain,
    Converter.toWei(poolsInput.value.amount)
  );

  if (txHash) {
    notify.push({
      title: 'Withdraw liquidity completed',
      description: 'Transaction was sent succesfully.',
      category: 'success',
      linkTitle: 'View Trx',
      linkUrl: `${poolsInput.value.chain.explorerUrl}/tx/${txHash}`
    });

    poolsInput.value.amount = undefined;

    updateBalances();
  } else {
    notify.push({
      title: 'Transaction failed',
      description: 'Try again later.',
      category: 'error'
    });
  }

  withdrawing.value = false;
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

  const tokenAddress = poolsInput.value.token.addresses[poolsInput.value.chain.chainId];

  if (!tokenAddress) {
    notify.push({
      title: 'Invalid token',
      description: 'Token not found.',
      category: 'error'
    });
    return;
  }

  const pool = getPool(
    poolsInput.value.chain.chainId,
    tokenAddress
  );

  if (!pool) {
    notify.push({
      title: 'Invalid ppol',
      description: 'Pool not found.',
      category: 'error'
    });
    return;
  }

  if (!poolsInput.value.amount || poolsInput.value.amount == 0) {
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

  let txHash: `0x${string}` | null = null;

  if (poolsInput.value.mode == Mode.DEPOSIT) {
    txHash = await approveTokens(
      poolsInput.value.token,
      poolsInput.value.chain,
      pool.poolAddress,
      Converter.toWei(poolsInput.value.amount)
    );
  } else {
    txHash = await approveLPTokens(
      pool,
      poolsInput.value.chain,
      pool.poolAddress,
      Converter.toWei(poolsInput.value.amount)
    );
  }

  if (txHash) {
    notify.push({
      title: 'Approval completed',
      description: 'Transaction was sent succesfully.',
      category: 'success',
      linkTitle: 'View Trx',
      linkUrl: `${poolsInput.value.chain.explorerUrl}/tx/${txHash}`
    });

    updateApprovals();

    if (poolsInput.value.mode == Mode.DEPOSIT) {
      deposit();
    } else {
      withdraw();
    }
  } else {
    notify.push({
      title: 'Transaction failed',
      description: 'Try again later.',
      category: 'error'
    });
  }

  approving.value = false;
};

// ================= UX Functions ================= //

const updateBalances = async () => {
  if (addressStore.address) {
    const balance = await getTokenBalance(
      poolsInput.value.token,
      poolsInput.value.chain,
      addressStore.address
    );

    poolsInput.value.balance = Converter.fromWei(balance);

    const tokenAddress = poolsInput.value.token.addresses[poolsInput.value.chain.chainId];

    if (!tokenAddress) return;

    const pool = getPool(
      poolsInput.value.chain.chainId,
      tokenAddress
    );

    if (!pool) return;

    const lpTokens = await getLPTokenBalance(
      pool,
      poolsInput.value.chain,
      addressStore.address
    );

    poolsInput.value.lpTokens = Converter.fromWei(lpTokens);
  }
};

const updateApprovals = async () => {
  const tokenAddress = poolsInput.value.token.addresses[poolsInput.value.chain.chainId];

  if (!tokenAddress) return;

  const pool = getPool(
    poolsInput.value.chain.chainId,
    tokenAddress
  );

  if (!pool) return;

  if (!addressStore.address) return;

  if (poolsInput.value.mode == Mode.DEPOSIT) {
    const allowance = await getAllowance(
      poolsInput.value.token,
      poolsInput.value.chain,
      addressStore.address,
      pool.poolAddress
    );

    poolsInput.value.approve = Converter.fromWei(allowance);
  } else {
    const allowance = await getLPAllowance(
      pool,
      poolsInput.value.chain,
      addressStore.address,
      pool.poolAddress
    );

    poolsInput.value.approve = Converter.fromWei(allowance);
  }
};

// ================= Modal Functions ================= //

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

const chainChanged = async (chain: Chain) => {
  poolsInput.value.chain = chain;
  poolsInput.value.token = findChainTokens(chain.chainId)[0];

  if (addressStore.address) {
    await switchChain(config, { chainId: chain.chainId });
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
  poolsInput,
  () => {
    updateBalances();
    updateApprovals();
  },
  {
    deep: true
  }
);

watch(
  computed(() => addressStore.address),
  () => {
    updateBalances();
    updateApprovals();
  }
);
</script>

<template>
  <section>
    <div class="app_width">
      <div class="pools_view">
        <div class="pools_title">
          <h3>Earn by providing liquidity.</h3>

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
                <p>Fee</p>
                <h3>0.1%</h3>
              </div>

              <div class="position">
                <p>Liquidty</p>
                <h3>-- {{ token.symbol }}</h3>
              </div>
            </div>
          </div>

          <div class="liquidity_widget">
            <div class="tabs">
              <button :class="poolsInput.mode == Mode.DEPOSIT ? 'tab tab_active' : 'tab'"
                @click="poolsInput.mode = Mode.DEPOSIT">Deposit</button>

              <button :class="poolsInput.mode == Mode.WITHDRAW ? 'tab tab_active' : 'tab'"
                @click="poolsInput.mode = Mode.WITHDRAW">Withdraw</button>
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
                  <input type="number" v-model="poolsInput.amount" placeholder="0">

                  <button class="token" @click="openTokenListModal()">
                    <img :src="poolsInput.token.image" :alt="poolsInput.token.name">
                    <p>{{ poolsInput.token.symbol }}</p>
                    <ChevronDownIcon />
                  </button>
                </div>

                <div class="liquidity_price">
                  <p v-if="poolsInput.mode == Mode.DEPOSIT">Bal: {{ Converter.toMoney(poolsInput.balance) }}</p>
                  <p v-else>LP Bal: {{ Converter.toMoney(poolsInput.lpTokens) }}</p>
                </div>
              </div>

              <div class="liquidity_action">
                <button v-if="!addressStore.address" @click="modal.open()">Connect Wallet</button>

                <button v-else-if="addressStore.address && poolsInput.approve < (poolsInput.amount || 0)"
                  @click="approve">{{
                    approving ? 'Approving..' : 'Approve ' }}</button>

                <button v-else-if="addressStore.address && poolsInput.mode == Mode.DEPOSIT" @click="deposit">{{
                  depositing ?
                    'Depositing..' : 'Deposit' }}</button>

                <button v-else @click="withdraw">{{ withdrawing ? 'Removing..' : 'Withdraw' }}</button>
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
.pools_view {
  padding-top: 40px;
  padding-bottom: 80px;
}

.pools_title {
  display: flex;
  align-items: center;
  gap: 20px;
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
  display: grid;
  justify-content: space-between;
  margin-top: 40px;
  gap: 40px;
  grid-template-columns: 1fr 420px;
  width: 100%;
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

@media screen and (max-width: 1200px) {
  .pools_title {
    justify-content: center;
  }

  .pools_title_chain {
    display: none;
  }

  .pools_grid {
    grid-template-columns: 1fr 340px;
  }
}

@media screen and (max-width: 1000px) {
  .pools_view {
    padding-top: 36px;
    padding-bottom: 100px;
  }

  .pools_title h3 {
    font-size: 36px;
  }

  .pools {
    display: none;
  }

  .pools_grid {
    grid-template-columns: 1fr;
  }
}
</style>
