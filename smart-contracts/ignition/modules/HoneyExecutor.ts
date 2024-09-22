import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HoneyExecutorModule = buildModule("HoneyExecutorModule", (m) => {
    const honeyExecutor = m.contract("HoneyExecutor");

    return { honeyExecutor };
});

export default HoneyExecutorModule;