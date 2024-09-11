import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HoneyRouter01ModuleSCROLL = buildModule("HoneyRouter01ModuleSCROLL", (m) => {
    const router = "0x4D7E6e482c77e9142bf92490772f4466e8634bC4";
    const treasury = "";
    const selector = 1020;

    const honeyRouter01 = m.contract("HoneyRouter01",
        [router, treasury, selector]
    );

    return { honeyRouter01 };
});

export default HoneyRouter01ModuleSCROLL;
