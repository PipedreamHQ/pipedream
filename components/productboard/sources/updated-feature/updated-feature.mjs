import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "productboard-updated-feature",
  name: "Updated Feature",
  description: "Emit new event when a feature is updated",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents() {
      const { data } = await this.productboard.listFeatures();
      return data;
    },
    getEventType() {
      return "feature.updated";
    },
    generateMeta(feature) {
      return {
        id: `${feature.id}${feature.updatedAt}`,
        summary: feature.name,
        ts: Date.parse(feature.updatedAt),
      };
    },
  },
};
