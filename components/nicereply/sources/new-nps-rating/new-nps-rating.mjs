import common from "../common/common.mjs";

export default {
  ...common,
  name: "New NPS Rating",
  version: "0.0.1",
  key: "nicereply-new-nps-rating",
  description: "Emit new event on each new NPS rating.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New NPS rating with id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
    getRatings() {
      return this.nicereply.getNPSRatings;
    },
  },
};
