import common from "../common/polling.mjs";

export default {
  ...common,
  key: "utradea-social-sentiment-notified",
  name: "Social Sentiment Notified",
  description: "Emit new event when identify changes in social media activity for a given stock or cryptocurrency on Twitter or StockTwits, [See the documentation here](https://utradea.com/api-docs#social-notifications-*-new-139).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "resource";
    },
    getResourceFn() {
      return this.app.listResources;
    },
    getResourceFnArgs() {
      return {};
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Resource: ${resource.name}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
