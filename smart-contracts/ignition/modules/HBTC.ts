import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HDAIModule = buildModule("HDAIModule", (m) => {
    const hbtc = m.contract("HBTC", []);

    return { hbtc };
});

export default HDAIModule;