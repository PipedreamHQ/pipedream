import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-new-deal",
  name: "New Deals",
  description: "Emit new event for each new deal created.",
  version: "0.0.11",
  dedupe: "unique",
  type: "source",
  hooks: {},
  methods: {
    ...common.methods,
    getTs(deal) {
      return Date.parse(deal.createdAt);
    },
    generateMeta(deal) {
      const {
        id,
        properties,
      } = deal;
      const ts = this.getTs(deal);
      return {
        id,
        summary: properties.dealname,
        ts,
      };
    },
    isRelevant(deal, createdAfter) {
      return this.getTs(deal) > createdAfter;
    },
    getParams() {
      return {
        limit: 100,
        sorts: [
          {
            propertyName: "createdate",
            direction: "DESCENDING",
          },
        ],
        object: "deals",
      };
    },
    async processResults(after, params) {
      await this.searchCRM(params, after);
    },
  },
};
