import common from "../common/common.mjs";

export default {
  ...common,
  name: "New CSTA Rating",
  version: "0.0.1",
  key: "nicereply-new-csta-rating",
  description: "Emit new event on each new CSTA rating.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New CSTA rating with id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
    getRatings() {
      return this.nicereply.getCSTARatings;
    },
  },
};
