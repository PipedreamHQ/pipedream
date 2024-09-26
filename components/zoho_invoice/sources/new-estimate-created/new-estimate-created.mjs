import common from "../common/polling.mjs";

export default {
  ...common,
  key: "zoho_invoice-new-estimate-created",
  name: "New Estimate Created",
  description: "Triggers when a new estimate is created. [See the documentation](https://www.zoho.com/invoice/api/v3/estimates/#list-estimates).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "estimates";
    },
    getResourceFn() {
      return this.app.listEstimates;
    },
    generateMeta(resource) {
      return {
        id: resource.estimate_id,
        summary: `New Estimate: ${resource.estimate_id}`,
        ts: Date.parse(resource.created_time),
      };
    },
  },
};
