import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TokenMapModule from "./TokenMap";
import HoneyFactoryModule from "./HoneyFactoryARBITRUM";
import { EquitoRouters, WETH } from "./EquitoRouters";
import HUSDTModule from "./HUSDT";
import HBTCModule from "./HBTC";

const HoneyRouter01ModuleARBITRUM = buildModule("HoneyRouter01ModuleARBITRUM", (m) => {
    const treasury = "0x60E0a0eAd051314E7510AE803334A97f13E6ff21";

    const { tokenMap } = m.useModule(TokenMapModule);
    const { honeyFactory } = m.useModule(HoneyFactoryModule);

    const { hbtc } = m.useModule(HBTCModule);
    const { husdt } = m.useModule(HUSDTModule);

    const honeyFeeMath = m.library("HoneyFeeMath");

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

    m.call(honeyFactory, "createPool", [WETH], { id: 'eth' });

    m.call(honeyFactory, "createPool", [hbtc], { id: 'hbtc' });

    m.call(honeyFactory, "createPool", [husdt], { id: 'husdt' });

    m.call(honeyRouter01, "addRouter", [
        "Pancakeswap",
        "{\"image\": \"/images/pancakeswap.png\", \"url\": \"https://pancakeswap.finance\"}",
        "0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb"
    ]);

    return { honeyRouter01 };
});

export default HoneyRouter01ModuleARBITRUM;
