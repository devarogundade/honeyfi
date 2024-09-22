## Introduction 

HoneyFi is a next-generation swap aggregator designed to provide users with the most efficient and cost-effective cross-chain swaps. Deployed on Bsc testnet, and Arbitrum Sepolia.

HoneyFi leverages Equito Network GMP to seamlessly pass messages between different blockchains. Whether you're performing a same-chain or cross-chain swap, HoneyFi ensures users benefit from the best rates available on the source chain.

## Description
HoneyFi aggregates the best swap rates across multiple blockchains and facilitates cross-chain transactions using Equito Network's General Message Passing (GMP) protocol. 

While same-chain swaps are entirely free, cross-chain swaps incur a minimal fee of just 0.1% of the receiving token. The platform is designed to prioritize user experience, allowing effortless asset transfers with minimal cost and delay. 

![Untitleddd.png](https://cdn.dorahacks.io/static/files/191e276cbe65ec2f57aeb1f404cade08.png)

## Liquidity Pools
HoneyFi provides liquidity pools where users can deposit their tokens to help facilitate cross-chain swaps. In return, liquidity providers (LPs) earn passive income from a portion of the fees collected during cross-chain swaps. This creates an opportunity for users to maximize their earnings by contributing to the platform's liquidity while supporting its ecosystem.

## Arbitrum Contracts

```
{
  "BasicRouterModule#BasicRouter": "0x2F87dD1A16dF12489eaB23506b4Db5D95479dA61",
  "HBTCModule#HBTC": "0x7925430C6968122d0968F28cfd3118318fD97319",
  "HUSDTModule#HUSDT": "0xFD132250838394168dFC2Da524C5Ee612715c431",
  "HoneyExecutorModule#HoneyExecutor": "0xbDD5A6fD93267B9dc3943361f6cF162bC201F6F7",
  "HoneyRouter01ModuleARBITRUM#HoneyFeeMath": "0xC2e568e71bf5E745110E1Ec8Cdc972C0b65c6D33",
  "TokenMapModule#TokenMap": "0x06E333dFADb83A8AF612f52A2A8C7A95B2C91D3c",
  "WBNBModule#WBNB": "0x14E0826c58f9C2a3a1B46b51F6d4705bCf0d6a22",
  "HoneyFactoryModuleARBITRUM#HoneyFactory": "0x8207EaE49615c6725646f998ba55Fcdcf859d447",
  "HoneyRouter01ModuleARBITRUM#HoneyRouter01": "0xdD7276F4e1983006033d583426e0D7947A7c14c8"
}
```

## BSC Contracts

```
{
  "BasicRouterModule#BasicRouter": "0xd3FDB9aCDA31B29e3867BAA1ad41B37196a906B4",
  "HBTCModule#HBTC": "0xE485cdD587BFfc8995B1E0A353c1BD49Fcc36003",
  "HUSDTModule#HUSDT": "0xaC19C35bB435AAABaa8478Ee6b70dceeC1BE164d",
  "HoneyExecutorModule#HoneyExecutor": "0x2123bC8b24fb75F0EF50c47A6376f1213Cb0F856",
  "HoneyRouter01ModuleBSC#HoneyFeeMath": "0x9C3078fF50b781525C6711c22f483Bb177092687",
  "TokenMapModule#TokenMap": "0x1f0B32c3A8BbDCfB6Dd941C2bbab44A8f5a5B13d",
  "WETHModule#WETH": "0x59a69f13E48e9B79650455c539bf5BB972d1eBF7",
  "HoneyFactoryModuleBSC#HoneyFactory": "0x87619381D1176d15811efb4ef8Fd84D1243d6DD4",
  "HoneyRouter01ModuleBSC#HoneyRouter01": "0x35aC37059E0756D0460290254a197982905ED909"
}
```
