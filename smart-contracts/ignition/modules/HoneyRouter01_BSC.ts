import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HoneyRouter01ModuleBSC = buildModule("HoneyRouter01ModuleBSC", (m) => {
    const router = "0x7E5cb6e9Fa1b8eb7A4d2384d1A2ECFEA552bc3B2";
    const treasury = "";
    const selector = 1002;

    const honeyRouter01 = m.contract("HoneyRouter01",
        [router, treasury, selector]
    );

    return { honeyRouter01 };
});

export default HoneyRouter01ModuleBSC;
