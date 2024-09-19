import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TokenMapModule from "./TokenMap";
import HoneyRouter01ModuleARBITRUM from "./HoneyRouter01ARBITRUM";
import { EquitoRouters } from "./EquitoRouters";

const HoneyFactoryModuleARBITRUM = buildModule("HoneyFactoryModuleARBITRUM", (m) => {
    const { tokenMap } = m.useModule(TokenMapModule);
    const { honeyRouter01 } = m.useModule(HoneyRouter01ModuleARBITRUM);

    const honeyFactory = m.contract("HoneyFactory", [
        tokenMap, EquitoRouters.ARBITRUM
    ]);

    m.call(honeyFactory, "addRouter", [honeyRouter01]);

    return { honeyFactory };
});

export default HoneyFactoryModuleARBITRUM;