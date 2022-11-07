import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Question Answer",
  version: "0.0.1",
  key: "iterate-new-question-answer-received",
  description: "Emit new event when a question is answered.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New question answer with id ${data.id}`,
        ts: Date.parse(data.updated_at[0]),
      });
    },
    getResources(args = {}) {
      return this.iterate.getAnswers(args);
    },
  },
};
