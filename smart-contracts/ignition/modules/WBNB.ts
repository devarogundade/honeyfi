import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const WBNBModule = buildModule("WBNBModule", (m) => {
    const wbnb = m.contract("WBNB");

    return { wbnb };
});

export default WBNBModule;