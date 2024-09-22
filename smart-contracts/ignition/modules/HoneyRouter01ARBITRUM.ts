import { ethers } from 'ethers';
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TokenMapModule from "./TokenMap";
import HoneyFactoryModule from "./HoneyFactoryARBITRUM";
import { EquitoRouters, WETH } from "./EquitoRouters";
import HUSDTModule from "./HUSDT";
import HBTCModule from "./HBTC";
import WBNBModule from "./WBNB";
import BasicRouterModule from "./BasicRouter";
import HoneyExecutorModule from './HoneyExecutor';

const HoneyRouter01ModuleARBITRUM = buildModule("HoneyRouter01ModuleARBITRUM", (m) => {
    const treasury = "0x60E0a0eAd051314E7510AE803334A97f13E6ff21";

    const { tokenMap } = m.useModule(TokenMapModule);
    const { honeyFactory } = m.useModule(HoneyFactoryModule);
    const { honeyExecutor } = m.useModule(HoneyExecutorModule);

    const { hbtc } = m.useModule(HBTCModule);
    const { husdt } = m.useModule(HUSDTModule);
    const { wbnb } = m.useModule(WBNBModule);

    const honeyFeeMath = m.library("HoneyFeeMath");
    const { basicRouter } = m.useModule(BasicRouterModule);

    const honeyRouter01 = m.contract(
        "HoneyRouter01",
        [tokenMap, EquitoRouters.ARBITRUM, treasury],
        {
            libraries: {
                HoneyFeeMath: honeyFeeMath
            }
        }
    );

    m.call(honeyFactory, "addRouter", [honeyRouter01]);

    m.call(honeyRouter01, "updateFactory", [honeyFactory]);

    m.call(honeyRouter01, "updateExecutor", [honeyExecutor]);

    m.call(honeyFactory, "createPool", [WETH], { id: 'lp_eth' });

    m.call(honeyFactory, "createPool", [wbnb], { id: 'lp_wbnb' });

    m.call(honeyFactory, "createPool", [hbtc], { id: 'lp_hbtc' });

    m.call(honeyFactory, "createPool", [husdt], { id: 'lp_husdt' });

    m.call(honeyExecutor, "addRouter", [
        "Basic Router",
        "{\"image\": \"/images/basic-router.png\", \"url\": \"https://honeyfi.netlify.app/basic-routers\"}",
        basicRouter
    ]);

    // Provide Liquidity
    m.call(wbnb, "transfer", [basicRouter, ethers.parseEther('1000000')], { id: "wbnb" });

    m.call(hbtc, "transfer", [basicRouter, ethers.parseEther('1000000')], { id: "hbtc" });

    m.call(husdt, "transfer", [basicRouter, ethers.parseEther('1000000')], { id: "husdt" });

    // Set Token Prices in USD
    m.call(basicRouter, "setTokenPrice", [wbnb, 581], { id: "bnb" });

    m.call(basicRouter, "setTokenPrice", [WETH, 2577], { id: "eth" });

    m.call(basicRouter, "setTokenPrice", [hbtc, 62784], { id: "btc" });

    m.call(basicRouter, "setTokenPrice", [husdt, 1], { id: "usdt" });

    return { honeyRouter01 };
});

export default HoneyRouter01ModuleARBITRUM;
