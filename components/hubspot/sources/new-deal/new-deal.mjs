import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-new-deal",
  name: "New Deals",
  description: "Emit new event for each new deal created.",
  version: "0.0.5",
  dedupe: "unique",
  type: "source",
  hooks: {},
  methods: {
    ...common.methods,
    generateMeta(deal) {
      const {
        id,
        properties,
        createdAt,
      } = deal;
      const ts = Date.parse(createdAt);
      return {
        id,
        summary: properties.dealname,
        ts,
      };
    },
    isRelevant(deal, createdAfter) {
      return Date.parse(deal.createdAt) > createdAfter;
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
