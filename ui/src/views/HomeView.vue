<script setup lang="ts">
import RefreshIcon from '@/components/icons/RefreshIcon.vue';
import FlipIcon from '@/components/icons/FlipIcon.vue';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue';
import OutIcon from '@/components/icons/OutIcon.vue';
import SortIcon from '@/components/icons/SortIcon.vue';
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
            <button class="swap_refresh">
              <RefreshIcon />
            </button>

            <button class="swap_slippage">
              <SortIcon />
              <p>1.00% slippage</p>
            </button>
          </div>

          <div class="swap_box">
            <div class="swap_box_child">
              <div class="swap_from_header">
                <p>You pay</p>

                <button class="chain">
                  <img src="/images/bsc.png" alt="">
                  <p>BSC</p>
                  <ChevronDownIcon />

                  <div class="chains_dropdown">
                    <button class="chain_dropdown">
                      <img src="" alt="">
                      <p>Scroll</p>
                    </button>
                  </div>
                </button>
              </div>

              <div class="swap_input">
                <input type="number" placeholder="0">

                <button class="token">
                  <img src="/images/usdt.png" alt="">
                  <p>hUSDT</p>
                  <ChevronDownIcon />

                  <div class="tokens_dropdown">
                    <button class="token_dropdown">
                      <img src="/images/btc.png" alt="">
                      <p>hBTC</p>
                    </button>
                  </div>
                </button>
              </div>

              <div class="swap_price">
                <p>$1.03</p>
              </div>
            </div>

            <div class="swap_flip">
              <button class="swap_flip_icon">
                <FlipIcon />
              </button>
            </div>

            <div class="swap_box_child">
              <div class="swap_from_header">
                <p>You receive</p>

                <button class="chain">
                  <img src="/images/scroll.png" alt="">
                  <p>Scroll</p>
                  <ChevronDownIcon />

                  <div class="chains_dropdown">
                    <button class="chain_dropdown">
                      <img src="/images/bsc.png" alt="">
                      <p>BSC</p>
                    </button>
                  </div>
                </button>
              </div>

              <div class="swap_input">
                <input type="number" disabled placeholder="0">

                <button class="token">
                  <img src="/images/btc.png" alt="">
                  <p>hBTC</p>
                  <ChevronDownIcon />

                  <div class="tokens_dropdown">
                    <button class="token_dropdown">
                      <img src="/images/usdt.png" alt="">
                      <p>hUSDT</p>
                    </button>
                  </div>
                </button>
              </div>

              <div class="swap_price">
                <p>$0</p>
              </div>
            </div>

            <div class="swap_action">
              <button>Connect Wallet</button>
            </div>
          </div>

          <div class="swap_info">
            <p>1 hUSDT ≈ 0.9654806 hBTC</p>

            <button class="swap_route">
              <img src="/images/pancakeswap.png" alt="">
              <p>Pancakeswap</p>
              <OutIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
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

.chains_dropdown {
  display: none;
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

.tokens_dropdown {
  display: none;
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