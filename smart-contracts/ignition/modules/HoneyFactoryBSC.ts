import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import TokenMapModule from "./TokenMap";
import HoneyRouter01ModuleBSC from "./HoneyRouter01BSC";
import { EquitoRouters } from "./EquitoRouters";

const HoneyFactoryModuleBSC = buildModule("HoneyFactoryModuleBSC", (m) => {
    const { tokenMap } = m.useModule(TokenMapModule);
    const { honeyRouter01 } = m.useModule(HoneyRouter01ModuleBSC);

    const honeyFactory = m.contract("HoneyFactory", [
        tokenMap, EquitoRouters.BSC
    ]);

    m.call(honeyFactory, "addRouter", [honeyRouter01]);

    return { honeyFactory };
});

export default HoneyFactoryModuleBSC;