import { defineStore } from 'pinia';

export const useAddressStore = defineStore('address', {
  state: () => ({
    address: null as `0x${string}` | null
  }),
  actions: {
    setAddress(newAddress: string) {
      this.address = newAddress as `0x${string}`;
    }
  }
});
