const common = require("../common.js");

module.exports = {
  ...common,
  key: "hubspot-new-deal",
  name: "New Deals",
  description: "Emits an event for each new deal created.",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(deal) {
      const { id, properties, createdAt } = deal;
      const ts = Date.parse(createdAt);
      return {
        id,
        summary: properties.dealname,
        ts,
      };
    },
    emitEvent(deal) {
      const meta = this.generateMeta(deal);
      this.$emit(deal, meta);
    },
    isRelevant(deal, createdAfter) {
      return Date.parse(deal.createdAt) > createdAfter;
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
      object: "deals",
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