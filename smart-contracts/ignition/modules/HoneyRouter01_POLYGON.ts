import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HoneyRouter01ModulePOLYGON = buildModule("HoneyRouter01ModulePOLYGON", (m) => {
    const router = "0xa5e465Be96341b4f1233eF334A4bac2e9Fd10981";
    const treasury = "";
    const selector = 1003;

    const honeyRouter01 = m.contract("HoneyRouter01",
        [router, treasury, selector]
    );

    return { honeyRouter01 };
});

export default HoneyRouter01ModulePOLYGON;
