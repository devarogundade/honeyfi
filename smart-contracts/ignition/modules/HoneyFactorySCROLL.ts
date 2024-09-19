import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TokenMapModule from "./TokenMap";
import { EquitoRouters } from "./EquitoRouters";

const HoneyFactoryModuleSCROLL = buildModule("HoneyFactoryModuleSCROLL", (m) => {
    const { tokenMap } = m.useModule(TokenMapModule);

    const honeyFactory = m.contract("HoneyFactory", [
        tokenMap, EquitoRouters.SCROLL
    ]);

    return { honeyFactory };
});

export default HoneyFactoryModuleSCROLL;