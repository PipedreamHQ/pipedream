import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Deal Created",
  key: "pipeline-new-deal-created",
  description: "Emit new event when a new deal is created in your Pipeline account.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.pipeline.listDeals;
    },
    generateMeta(deal) {
      return {
        id: deal.id,
        summary: deal.name,
        ts: Date.parse(deal.created_at),
      };
    },
  },
};
