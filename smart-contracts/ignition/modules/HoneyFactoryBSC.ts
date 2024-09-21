import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TokenMapModule from "./TokenMap";
import { EquitoRouters } from "./EquitoRouters";

const HoneyFactoryModuleBSC = buildModule("HoneyFactoryModuleBSC", (m) => {
    const { tokenMap } = m.useModule(TokenMapModule);

    const honeyFactory = m.contract("HoneyFactory", [
        tokenMap, EquitoRouters.BSC
    ]);

    return { honeyFactory };
});

export default HoneyFactoryModuleBSC;