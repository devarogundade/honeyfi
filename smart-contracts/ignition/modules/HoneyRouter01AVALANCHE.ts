import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TokenMapModule from "./TokenMap";
import { EquitoRouters } from "./EquitoRouters";

const HoneyRouter01ModuleAVALANCHE = buildModule("HoneyRouter01ModuleAVALANCHE", (m) => {
    const treasury = "0x60E0a0eAd051314E7510AE803334A97f13E6ff21";

    const { tokenMap } = m.useModule(TokenMapModule);

    const honeyFeeMath = m.library("HoneyFeeMath");

    const honeyRouter01 = m.contract(
        "HoneyRouter01",
        [tokenMap, EquitoRouters.AVALANCHE, treasury],
        {
            libraries: {
                HoneyFeeMath: honeyFeeMath
            }
        }
    );

    return { honeyRouter01 };
});

export default HoneyRouter01ModuleAVALANCHE;
