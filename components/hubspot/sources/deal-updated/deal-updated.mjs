import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-deal-updated",
  name: "Deal Updated",
  description: "Emit new event each time a deal is updated.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  hooks: {},
  methods: {
    ...common.methods,
    generateMeta(deal) {
      const {
        id,
        properties,
        updatedAt,
      } = deal;
      const ts = Date.parse(updatedAt);
      return {
        id: `${id}${ts}`,
        summary: properties.dealname,
        ts,
      };
    },
    isRelevant(deal, updatedAfter) {
      return Date.parse(deal.updatedAt) > updatedAfter;
    },
    getParams() {
      return {
        limit: 100,
        sorts: [
          {
            propertyName: "hs_lastmodifieddate",
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
