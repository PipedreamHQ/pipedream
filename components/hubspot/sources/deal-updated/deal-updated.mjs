import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-deal-updated",
  name: "Deal Updated",
  description: "Emits an event each time a deal is updated.",
  version: "0.0.3",
  type: "source",
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
  },
  async run() {
    const updatedAfter = this._getAfter();
    const data = {
      limit: 100,
      sorts: [
        {
          propertyName: "hs_lastmodifieddate",
          direction: "DESCENDING",
        },
      ],
      object: "deals",
    };
    await this.paginate(
      data,
      this.hubspot.searchCRM.bind(this),
      "results",
      updatedAfter,
    );
    this._setAfter(Date.now());
  },
};
