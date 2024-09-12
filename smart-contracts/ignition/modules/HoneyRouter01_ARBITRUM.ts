import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HoneyRouter01ModuleARBITRUM = buildModule("HoneyRouter01ModuleARBITRUM", (m) => {
    const router = "0x5C5386A7D14d9D6c24913386db74c20e36Bc436c";
    const treasury = "0x60E0a0eAd051314E7510AE803334A97f13E6ff21";
    const selector = 1004;

    const honeyRouter01 = m.contract("HoneyRouter01",
        [router, treasury, selector]
    );

    m.call(honeyRouter01, "addRouter", [
        "Pancakeswap",
        "0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb",
        "https://pancakeswap.finance/"
    ]);

    return { honeyRouter01 };
});

export default HoneyRouter01ModuleARBITRUM;
