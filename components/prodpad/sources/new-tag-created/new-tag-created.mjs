import common from "../common/polling.mjs";

export default {
  ...common,
  key: "prodpad-new-tag-created",
  name: "New Tag Created",
  description: "Emit new event when a new tag is created. [See the docs](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Misc/GetTags).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getRequestResourcesFn() {
      return this.app.listTags;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.created_at),
        summary: `New Tag ${resource.id}`,
      };
    },
  },
};
