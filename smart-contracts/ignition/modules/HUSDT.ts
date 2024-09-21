import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HUSDTModule = buildModule("HUSDTModule", (m) => {
    const husdt = m.contract("HUSDT");

    return { husdt };
});

export default HUSDTModule;