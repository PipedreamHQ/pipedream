import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-company-updated",
  name: "Company Updated",
  description: "Emit new event each time a company is updated.",
  version: "0.0.12",
  dedupe: "unique",
  type: "source",
  hooks: {},
  methods: {
    ...common.methods,
    getTs(company) {
      return Date.parse(company.updatedAt);
    },
    generateMeta(company) {
      const {
        id,
        properties,
      } = company;
      const ts = this.getTs(company);
      return {
        id: `${id}${ts}`,
        summary: properties.name,
        ts,
      };
    },
    isRelevant(company, updatedAfter) {
      return this.getTs(company) > updatedAfter;
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
