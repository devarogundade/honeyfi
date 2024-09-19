import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TokenMapModule from "./TokenMap";
import HoneyRouter01ModuleAVALANCHE from "./HoneyRouter01AVALANCHE";
import { EquitoRouters } from "./EquitoRouters";

const HoneyFactoryModuleAVALANCHE = buildModule("HoneyFactoryModuleAVALANCHE", (m) => {
    const { tokenMap } = m.useModule(TokenMapModule);
    const { honeyRouter01 } = m.useModule(HoneyRouter01ModuleAVALANCHE);

    const honeyFactory = m.contract("HoneyFactory", [
        tokenMap, EquitoRouters.AVALANCHE
    ]);

    m.call(honeyFactory, "addRouter", [honeyRouter01]);

    return { honeyFactory };
});

export default HoneyFactoryModuleAVALANCHE;