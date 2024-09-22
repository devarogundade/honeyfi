import { ethers } from 'ethers';
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TokenMapModule from "./TokenMap";
import { EquitoRouters, WETH as BNB, Bytes64 } from "./EquitoRouters";
import HoneyFactoryModuleBSC from "./HoneyFactoryBSC";
import HUSDTModule from "./HUSDT";
import HBTCModule from "./HBTC";
import WETHModule from "./WETH";
import BasicRouterModule from "./BasicRouter";
import HoneyExecutorModule from './HoneyExecutor';

const HoneyRouter01ModuleBSC = buildModule("HoneyRouter01ModuleBSC", (m) => {
    const treasury = "0x60E0a0eAd051314E7510AE803334A97f13E6ff21";

    const { tokenMap } = m.useModule(TokenMapModule);
    const { honeyFactory } = m.useModule(HoneyFactoryModuleBSC);
    const { honeyExecutor } = m.useModule(HoneyExecutorModule);

    const { hbtc } = m.useModule(HBTCModule);
    const { husdt } = m.useModule(HUSDTModule);
    const { weth } = m.useModule(WETHModule);
    const { basicRouter } = m.useModule(BasicRouterModule);

    const honeyFeeMath = m.library("HoneyFeeMath");

    const honeyRouter01 = m.contract(
        "HoneyRouter01",
        [tokenMap, EquitoRouters.BSC, treasury],
        {
            libraries: {
                HoneyFeeMath: honeyFeeMath
            }
        }
    );

    m.call(honeyFactory, "addRouter", [honeyRouter01]);

    m.call(honeyRouter01, "updateFactory", [honeyFactory]);

    m.call(honeyRouter01, "updateExecutor", [honeyExecutor]);

    m.call(honeyFactory, "createPool", [BNB], { id: 'lp_bnb' });

    m.call(honeyFactory, "createPool", [weth], { id: 'lp_weth' });

    m.call(honeyFactory, "createPool", [hbtc], { id: 'lp_hbtc' });

    m.call(honeyFactory, "createPool", [husdt], { id: 'lp_husdt' });

    m.call(honeyExecutor, "addRouter", [
        "Basic Router",
        "{\"image\": \"/images/basic-router.png\", \"url\": \"https://honeyfi.netlify.app/basic-routers\"}",
        basicRouter
    ]);

    // Provide Liquidity
    m.call(weth, "transfer", [basicRouter, ethers.parseEther('1000000')], { id: "weth" });

    m.call(hbtc, "transfer", [basicRouter, ethers.parseEther('1000000')], { id: "hbtc" });

    m.call(husdt, "transfer", [basicRouter, ethers.parseEther('1000000')], { id: "husdt" });

    // Set Token Prices in USD
    m.call(basicRouter, "setTokenPrice", [BNB, 581], { id: "bnb" });

    m.call(basicRouter, "setTokenPrice", [weth, 2577], { id: "eth" });

    m.call(basicRouter, "setTokenPrice", [hbtc, 62784], { id: "btc" });

    m.call(basicRouter, "setTokenPrice", [husdt, 1], { id: "usdt" });

    // Set Peers
    const ARBITRUM_SELECTOR = 1004;
    const ARBITRUM_FACTORY: Bytes64 = {
        lower: "0x0000000000000000000000008207eae49615c6725646f998ba55fcdcf859d447",
        upper: "0x0000000000000000000000000000000000000000000000000000000000000000"
    };
    const ARBITRUM_ROUTER: Bytes64 = {
        lower: "0x000000000000000000000000dd7276f4e1983006033d583426e0d7947a7c14c8",
        upper: "0x0000000000000000000000000000000000000000000000000000000000000000"
    };

    m.call(honeyFactory, "setPeers", [[ARBITRUM_SELECTOR], [ARBITRUM_FACTORY]]);

    m.call(honeyRouter01, "setPeers", [[ARBITRUM_SELECTOR], [ARBITRUM_ROUTER]]);

    // Set Token Map
    m.call(tokenMap, "set", [BNB, ARBITRUM_SELECTOR, "0x14E0826c58f9C2a3a1B46b51F6d4705bCf0d6a22"], { id: "set_bnb" });

    m.call(tokenMap, "set", [weth, ARBITRUM_SELECTOR, "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"], { id: "set_weth" });

    m.call(tokenMap, "set", [hbtc, ARBITRUM_SELECTOR, "0x7925430C6968122d0968F28cfd3118318fD97319"], { id: "set_hbtc" });

    m.call(tokenMap, "set", [husdt, ARBITRUM_SELECTOR, "0xFD132250838394168dFC2Da524C5Ee612715c431"], { id: "set_husdt" });

    return { honeyRouter01 };
});

export default HoneyRouter01ModuleBSC;
