import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TokenMapModule = buildModule("TokenMapModule", (m) => {
    const tokenMap = m.contract("TokenMap", []);

    return { tokenMap };
});

export default TokenMapModule;