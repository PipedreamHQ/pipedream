import common from "../common/polling.mjs";

export default {
  ...common,
  key: "prodpad-new-user-story-created",
  name: "New User Story Created",
  description: "Emit new event when a new user story is created. [See the docs](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Ideas/GetUserStories).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getRequestResourcesFn() {
      return this.app.listUserstories;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.created_at),
        summary: `New User Story ${resource.id}`,
      };
    },
  },
};
