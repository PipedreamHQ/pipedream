import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Survey Response",
  version: "0.0.3",
  key: "iterate-new-survey-response-received",
  description: "Emit new event when a survey is answered.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: `${data.user.id}-${data.completed_at}`,
        summary: `New survey response with user id ${data.user.id}`,
        ts: Date.parse(data.completed_at),
      });
    },
    getResources(args = {}) {
      return this.iterate.getResponses(args);
    },
  },
};
