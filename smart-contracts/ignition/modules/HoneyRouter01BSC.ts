import { ethers } from 'ethers';
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TokenMapModule from "./TokenMap";
import { EquitoRouters, WETH as BNB } from "./EquitoRouters";
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

    return { honeyRouter01 };
});

export default HoneyRouter01ModuleBSC;
