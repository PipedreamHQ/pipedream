import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Sale",
  version: "0.0.3",
  key: "gumroad-new-sale",
  description: "Emit new event on each new sale.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New sale with id ${data.id}`,
        ts: Date.parse(data.created_at),
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
