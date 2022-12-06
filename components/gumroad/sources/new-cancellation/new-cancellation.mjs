import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Cancellation",
  version: "0.0.2",
  key: "gumroad-new-cancellation",
  description: "Emit new event on a sale is cancelled.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      if (!data.cancelled) {
        return;
      }

      this.$emit(data, {
        id: data.id,
        summary: `New sale cancelled with id ${data.id}`,
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
