const common = require("../common.js");

module.exports = {
  ...common,
  key: "hubspot-new-company",
  name: "New Companies",
  description: "Emits an event for each new company added.",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(company) {
      const { id, properties, createdAt } = company;
      const ts = Date.parse(createdAt);
      return {
        id,
        summary: properties.name,
        ts,
      };
    },
    emitEvent(company) {
      const meta = this.generateMeta(company);
      this.$emit(company, meta);
    },
    isRelevant(company, createdAfter) {
      return Date.parse(company.createdAt) > createdAfter;
    },
  },
  async run(event) {
    const createdAfter =
      this.db.get("createdAfter") || Date.parse(this.hubspot.monthAgo());
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
      createdAfter
    );

    this.db.set("createdAfter", Date.now());
  },
};