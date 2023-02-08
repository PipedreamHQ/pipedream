import common from "../common/polling.mjs";

export default {
  ...common,
  key: "prodpad-new-idea-feedback-created",
  name: "New Idea Feedback Created",
  description: "Emit new event when a new feedback is created for an idea. [See the docs]https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Ideas/GetIdeaFeedback).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    feedbackId: {
      propDefinition: [
        common.props.app,
        "feedbackId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getRequestResourcesFn() {
      return this.app.listFeedbackIdeas;
    },
    getRequestResourcesArgs() {
      return {
        feedbackId: this.feedbackId,
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.created_at),
        summary: `New Feedback Idea ${resource.id}`,
      };
    },
  },
};
