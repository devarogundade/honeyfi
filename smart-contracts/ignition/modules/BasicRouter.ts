import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BasicRouterModule = buildModule("BasicRouterModule", (m) => {
    const basicRouter = m.contract("BasicRouter");

    return { basicRouter };
});

export default BasicRouterModule;