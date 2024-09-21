import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TokenMapModule from "./TokenMap";
import HoneyFactoryModule from "./HoneyFactoryARBITRUM";
import { EquitoRouters } from "./EquitoRouters";

const HoneyRouter01ModuleARBITRUM = buildModule("HoneyRouter01ModuleARBITRUM", (m) => {
    const treasury = "0x60E0a0eAd051314E7510AE803334A97f13E6ff21";

    const { tokenMap } = m.useModule(TokenMapModule);
    const { honeyFactory } = m.useModule(HoneyFactoryModule);

    const honeyFeeMath = m.library("HoneyFeeMath");

    const honeyRouter01 = m.contract(
        "HoneyRouter01",
        [honeyFactory, tokenMap, EquitoRouters.ARBITRUM, treasury],
        {
            libraries: {
                HoneyFeeMath: honeyFeeMath
            }
        }
    );

    m.call(honeyFactory, "addRouter", [honeyRouter01]);

    m.call(honeyRouter01, "updateFactory", [honeyFactory]);

    return { honeyRouter01 };
});

export default HoneyRouter01ModuleARBITRUM;
