import common from "../common/polling.mjs";

export default {
  ...common,
  key: "supercast-new-question-created",
  name: "New Question Created",
  description: "Emit new event when a new question is created. [See the documentation](https://supercast.readme.io/reference/getquestions)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listQuestions;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Question: ${resource.title}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
