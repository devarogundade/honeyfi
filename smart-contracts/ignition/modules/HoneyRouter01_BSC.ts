import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HoneyRouter01ModuleBSC = buildModule("HoneyRouter01ModuleBSC", (m) => {
    const router = "0x7E5cb6e9Fa1b8eb7A4d2384d1A2ECFEA552bc3B2";
    const treasury = "0x60E0a0eAd051314E7510AE803334A97f13E6ff21";
    const selector = 1002;

    const honeyRouter01 = m.contract("HoneyRouter01",
        [router, treasury, selector]
    );

    m.call(honeyRouter01, "addRouter", [
        "Pancakeswap",
        "0x10ED43C718714eb63d5aA57B78B54704E256024E",
        "https://pancakeswap.finance/"
    ]);

    return { honeyRouter01 };
});

export default HoneyRouter01ModuleBSC;
