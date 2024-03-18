import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-new-company",
  name: "New Companies",
  description: "Emit new event for each new company added.",
  version: "0.0.16",
  dedupe: "unique",
  type: "source",
  hooks: {},
  methods: {
    ...common.methods,
    getTs(company) {
      return Date.parse(company.createdAt);
    },
    generateMeta(company) {
      const {
        id,
        properties,
      } = company;
      const ts = this.getTs(company);
      return {
        id,
        summary: properties.name,
        ts,
      };
    },
    isRelevant(company, createdAfter) {
      return this.getTs(company) > createdAfter;
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
        object: "companies",
      };
    },
    async processResults(after, params) {
      await this.searchCRM(params, after);
    },
  },
};
