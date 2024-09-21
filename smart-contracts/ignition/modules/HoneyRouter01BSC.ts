import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TokenMapModule from "./TokenMap";
import { EquitoRouters, WETH as BNB } from "./EquitoRouters";
import HoneyFactoryModuleBSC from "./HoneyFactoryBSC";
import HUSDTModule from "./HUSDT";
import HBTCModule from "./HBTC";
import WETHModule from "./WETH";

const HoneyRouter01ModuleBSC = buildModule("HoneyRouter01ModuleBSC", (m) => {
    const treasury = "0x60E0a0eAd051314E7510AE803334A97f13E6ff21";

    const { tokenMap } = m.useModule(TokenMapModule);
    const { honeyFactory } = m.useModule(HoneyFactoryModuleBSC);

    const { hbtc } = m.useModule(HBTCModule);
    const { husdt } = m.useModule(HUSDTModule);
    const { weth } = m.useModule(WETHModule);

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

    m.call(honeyFactory, "createPool", [BNB], { id: 'bnb' });

    m.call(honeyFactory, "createPool", [weth], { id: 'weth' });

    m.call(honeyFactory, "createPool", [hbtc], { id: 'hbtc' });

    m.call(honeyFactory, "createPool", [husdt], { id: 'husdt' });

    m.call(honeyRouter01, "addRouter", [
        "Pancakeswap",
        "{\"image\": \"/images/pancakeswap.png\", \"url\": \"https://pancakeswap.finance\"}",
        "0x10ED43C718714eb63d5aA57B78B54704E256024E"
    ]);

    return { honeyRouter01 };
});

export default HoneyRouter01ModuleBSC;
