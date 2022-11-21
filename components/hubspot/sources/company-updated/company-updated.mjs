import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-company-updated",
  name: "Company Updated",
  description: "Emit new event each time a company is updated.",
  version: "0.0.4",
  dedupe: "unique",
  type: "source",
  hooks: {},
  methods: {
    ...common.methods,
    generateMeta(company) {
      const {
        id,
        properties,
        updatedAt,
      } = company;
      const ts = Date.parse(updatedAt);
      return {
        id: `${id}${ts}`,
        summary: properties.name,
        ts,
      };
    },
    isRelevant(company, updatedAfter) {
      return Date.parse(company.updatedAt) > updatedAfter;
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
        object: "companies",
      };
    },
    async processResults(after, params) {
      await this.searchCRM(params, after);
    },
  },
};
