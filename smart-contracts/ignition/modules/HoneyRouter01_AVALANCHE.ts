import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HoneyRouter01ModuleAVALANCHE = buildModule("HoneyRouter01ModuleAVALANCHE", (m) => {
    const router = "0xc75E01e91ba540A22bb85bdB60e6a830F3560777";
    const treasury = "";
    const selector = 1005;

    const honeyRouter01 = m.contract("HoneyRouter01",
        [router, treasury, selector]
    );

    return { honeyRouter01 };
});

export default HoneyRouter01ModuleAVALANCHE;
