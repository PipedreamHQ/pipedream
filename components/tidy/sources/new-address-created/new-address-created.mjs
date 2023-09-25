import common from "../common/common.mjs";

export default {
  ...common,
  key: "tidy-new-address-created",
  name: "New Address Created",
  description: "Emit new event when a new address is created in Tidy",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getItems() {
      const { data } = await this.tidy.listAddresses();
      return data;
    },
    generateMeta(address) {
      return {
        id: address.id,
        summary: `${address.address}`,
        ts: Date.parse(address.created_at),
      };
    },
  },
};
