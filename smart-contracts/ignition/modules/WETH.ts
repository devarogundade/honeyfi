import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const WETHModule = buildModule("WETHModule", (m) => {
    const weth = m.contract("WETH");

    return { weth };
});

export default WETHModule;