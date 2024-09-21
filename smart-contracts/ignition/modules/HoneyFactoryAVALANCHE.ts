import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TokenMapModule from "./TokenMap";
import { EquitoRouters } from "./EquitoRouters";

const HoneyFactoryModuleAVALANCHE = buildModule("HoneyFactoryModuleAVALANCHE", (m) => {
    const { tokenMap } = m.useModule(TokenMapModule);

    const honeyFactory = m.contract("HoneyFactory", [
        tokenMap, EquitoRouters.AVALANCHE
    ]);

    return { honeyFactory };
});

export default HoneyFactoryModuleAVALANCHE;