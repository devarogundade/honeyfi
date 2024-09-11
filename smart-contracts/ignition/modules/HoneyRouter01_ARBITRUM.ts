import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HoneyRouter01ModuleARBITRUM = buildModule("HoneyRouter01ModuleARBITRUM", (m) => {
    const router = "0x5C5386A7D14d9D6c24913386db74c20e36Bc436c";
    const treasury = "";
    const selector = 1004;

    const honeyRouter01 = m.contract("HoneyRouter01",
        [router, treasury, selector]
    );

    return { honeyRouter01 };
});

export default HoneyRouter01ModuleARBITRUM;
