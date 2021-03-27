const common = require("../common.js");

module.exports = {
  ...common,
  key: "hubspot-deal-updated",
  name: "Deal Updated",
  description: "Emits an event each time a deal is updated.",
  version: "0.0.2",
  methods: {
    ...common.methods,
    generateMeta(deal) {
      const { id, properties, updatedAt } = deal;
      const ts = Date.parse(updatedAt);
      return {
        id: `${id}${ts}`,
        summary: properties.dealname,
        ts,
      };
    },
    emitEvent(deal) {
      const meta = this.generateMeta(deal);
      this.$emit(deal, meta);
    },
    isRelevant(deal, updatedAfter) {
      return Date.parse(deal.updatedAt) > updatedAfter;
    },
  },
  async run(event) {
    const updatedAfter =
      this.db.get("updatedAfter") || Date.parse(this.hubspot.monthAgo());
    const data = {
      limit: 100,
      sorts: [
        {
          propertyName: "lastmodifieddate",
          direction: "DESCENDING",
        },
      ],
      object: "deals",
    };
    await this.paginate(
      data,
      this.hubspot.searchCRM.bind(this),
      "results",
      updatedAfter
    );
    this.db.set("updatedAfter", Date.now());
  },
};