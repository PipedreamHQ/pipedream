import common from "../common/common.mjs";

export default {
  ...common,
  name: "New CSAT Rating",
  version: "0.0.2",
  key: "nicereply-new-csat-rating",
  description: "Emit new event on each new CSAT rating.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New CSAT rating with id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
    getRatings() {
      return this.nicereply.getCSTARatings;
    },
  },
};
