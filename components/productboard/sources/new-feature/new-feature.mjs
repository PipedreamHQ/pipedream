import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "productboard-new-feature",
  name: "New Feature",
  description: "Emit new event when a new feature is added",
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
      return "feature.created";
    },
    generateMeta(feature) {
      return {
        id: feature.id,
        summary: feature.name,
        ts: Date.parse(feature.createdAt),
      };
    },
  },
};
