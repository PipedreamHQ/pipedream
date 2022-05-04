import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-new-company",
  name: "New Companies",
  description: "Emits an event for each new company added.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  hooks: {},
  methods: {
    ...common.methods,
    generateMeta(company) {
      const {
        id,
        properties,
        createdAt,
      } = company;
      const ts = Date.parse(createdAt);
      return {
        id,
        summary: properties.name,
        ts,
      };
    },
    isRelevant(company, createdAfter) {
      return Date.parse(company.createdAt) > createdAfter;
    },
  },
  async run() {
    const createdAfter = this._getAfter();
    const data = {
      limit: 100,
      sorts: [
        {
          propertyName: "createdate",
          direction: "DESCENDING",
        },
      ],
      object: "companies",
    };

    await this.paginate(
      data,
      this.hubspot.searchCRM.bind(this),
      "results",
      createdAfter,
    );

    this._setAfter(Date.now());
  },
};
