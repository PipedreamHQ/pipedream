import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Refund",
  version: "0.0.3",
  key: "gumroad-new-refund",
  description: "Emit new event on a sale is refunded.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      if (!data.chargedback) {
        return;
      }

      this.$emit(data, {
        id: data.id,
        summary: `New sale refunded with id ${data.id}`,
        ts: new Date(),
      });
    },
    getResources() {
      return this.gumroad.getSales();
    },
    getResourcesKey() {
      return "sales";
    },
  },
};
