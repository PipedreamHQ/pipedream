import common from "../common/polling.mjs";

export default {
  ...common,
  key: "prodpad-new-idea-created",
  name: "New Idea Created",
  description: "Emit new event when a new idea is created. [See the docs](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Ideas/GetIdeas).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getRequestResourcesFn() {
      return this.app.listIdeas;
    },
    getResourceName() {
      return "ideas";
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.created_at),
        summary: `New Idea ${resource.id}`,
      };
    },
  },
};
