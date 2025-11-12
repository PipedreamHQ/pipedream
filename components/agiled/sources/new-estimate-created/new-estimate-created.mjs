import common from "../common/polling.mjs";

export default {
  ...common,
  key: "agiled-new-estimate-created",
  name: "New Estimate Created",
  description: "Emit new event when a new estimate is created in Agiled. [See the documentation](https://my.agiled.app/developers)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listEstimates;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Estimate: ${resource.id}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
