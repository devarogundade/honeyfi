import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TokenMapModule from "./TokenMap";
import { EquitoRouters } from "./EquitoRouters";

const HoneyFactoryModuleARBITRUM = buildModule("HoneyFactoryModuleARBITRUM", (m) => {
    const { tokenMap } = m.useModule(TokenMapModule);

    const honeyFactory = m.contract("HoneyFactory", [
        tokenMap, EquitoRouters.ARBITRUM
    ]);

    return { honeyFactory };
});

export default HoneyFactoryModuleARBITRUM;