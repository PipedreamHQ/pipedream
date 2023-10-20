import common from "../common/polling.mjs";

export default {
  ...common,
  key: "prodpad-new-feedback-created",
  name: "New Feedback Created",
  description: "Emit new event when a new feedback is created. [See the docs](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Feedback/GetFeedbacks).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getRequestResourcesFn() {
      return this.app.listFeedbacks;
    },
    getResourceName() {
      return "feedbacks";
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.created_at),
        summary: `New Feedback ${resource.id}`,
      };
    },
  },
};
