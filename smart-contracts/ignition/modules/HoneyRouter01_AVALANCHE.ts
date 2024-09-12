import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HoneyRouter01ModuleAVALANCHE = buildModule("HoneyRouter01ModuleAVALANCHE", (m) => {
    const router = "0xc75E01e91ba540A22bb85bdB60e6a830F3560777";
    const treasury = "0x60E0a0eAd051314E7510AE803334A97f13E6ff21";
    const selector = 1005;

    const honeyRouter01 = m.contract("HoneyRouter01",
        [router, treasury, selector]
    );

    m.call(honeyRouter01, "addRouter", [
        "Hurricaneswap",
        "0x7E3411B04766089cFaa52DB688855356A12f05D1",
        "http://hurricaneswap.com"
    ]);

    return { honeyRouter01 };
});

export default HoneyRouter01ModuleAVALANCHE;
