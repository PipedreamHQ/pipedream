import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-new-deal",
  name: "New Deals",
  description: "Emits an event for each new deal created.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
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
      object: "deals",
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
