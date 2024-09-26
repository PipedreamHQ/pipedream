import common from "../common/polling.mjs";

export default {
  ...common,
  key: "rafflys-new-lead",
  name: "New Lead",
  description: "Emit new event when a lead is collected.",
  version: "0.0.1",
  type: "source",
  dedupe: "greatest",
  methods: {
    ...common.methods,
    listPromotionLeads({
      promotionId, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/promotions/${promotionId}/leads`,
        ...args,
      });
    },
    getResourceName() {
      return "data";
    },
    getResourceFn() {
      return this.listPromotionLeads;
    },
    getResourceFnArgs() {
      return {
        promotionId: this.promotionId,
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Lead: ${resource.id}`,
        ts: Date.parse(resource.created),
      };
    },
  },
};
