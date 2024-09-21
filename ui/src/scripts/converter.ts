import convert from './baseconverter';

const Converter = {
    fineHash: function (hash: string | null, space: number) {
        if (hash == null || hash.length == 0) return '- - - - -';
        return hash.substring(0, space) + '...' + hash.substring(hash.length - space, hash.length);
    },

    fromWei: function (wei: bigint): number {
        try {
            if (wei == BigInt(0)) return 0;
            return convert(wei, 'wei', 'ether');
        } catch (error) {
            console.error('ether', error);
            return 0;
        }
    },

    toWei: function (ether: string | number): bigint {
        try {
            if (ether == '') return BigInt(0);
            return convert(ether, 'ether', 'wei');
        } catch (error) {
            console.error('wei', error);
            return BigInt(0);
        }
    },

    toMoney: function (amount: any, max = null, hasComma = true) {
        let maxF = max ? max : 6;
        if (amount > 1) {
            maxF = 4;
        }
        if (amount > 10) {
            maxF = 3;
        }
        if (amount > 200) {
            maxF = 2;
        }

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'decimal',
            useGrouping: hasComma,
            minimumFractionDigits: 2,
            maximumFractionDigits: maxF,
        });

        return formatter.format(amount);
    }
};

export default Converter;