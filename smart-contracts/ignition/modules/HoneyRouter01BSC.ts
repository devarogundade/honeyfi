import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TokenMapModule from "./TokenMap";
import { EquitoRouters } from "./EquitoRouters";

const HoneyRouter01ModuleBSC = buildModule("HoneyRouter01ModuleBSC", (m) => {
    const router = "0x7E5cb6e9Fa1b8eb7A4d2384d1A2ECFEA552bc3B2";
    const treasury = "0x60E0a0eAd051314E7510AE803334A97f13E6ff21";

    const { tokenMap } = m.useModule(TokenMapModule);

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

    return { honeyRouter01 };
});

export default HoneyRouter01ModuleBSC;
