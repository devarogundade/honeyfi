import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HBTCModule = buildModule("HBTCModule", (m) => {
    const hbtc = m.contract("HBTC");

    return { hbtc };
});

export default HBTCModule;