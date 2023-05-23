import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-new-deal-property-change",
  name: "New Deal Property Change",
  description: "Emit new event when a specified property is provided or updated on a deal. [See the docs here](https://developers.hubspot.com/docs/api/crm/deals)",
  version: "0.0.3",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    property: {
      type: "string",
      label: "Property",
      description: "The deal property to watch for changes",
      async options() {
        const properties = await this.hubspot.getDealProperties();
        return properties.map((property) => property.name);
      },
    },
  },
  hooks: {},
  methods: {
    ...common.methods,
    getTs(deal) {
      const history = deal.propertiesWithHistory[this.property];
      if (!history || !(history.length > 0)) {
        return;
      }
      return Date.parse(history[0].timestamp);
    },
    generateMeta(deal) {
      const {
        id,
        properties,
      } = deal;
      const ts = this.getTs(deal);
      return {
        id: `${id}${ts}`,
        summary: properties.dealname,
        ts,
      };
    },
    isRelevant(deal, updatedAfter) {
      return !updatedAfter || this.getTs(deal) > updatedAfter;
    },
    getParams() {
      return {
        limit: 50,
        sorts: [
          {
            propertyName: "hs_lastmodifieddate",
            direction: "DESCENDING",
          },
        ],
        propertiesWithHistory: this.property,
      };
    },
    async processResults(after, params) {
      let maxTs = after;
      const limiter = this._limiter();

      do {
        const {
          results, paging,
        } = await limiter.schedule(async () => await this.hubspot.listObjectsInPage("deals", null, params));
        if (paging) {
          params.after = paging.next.after;
        } else {
          delete params.after;
        }
        for (const result of results) {
          if (this.isRelevant(result, after)) {
            this.emitEvent(result);
            const ts = this.getTs(result);
            if (ts > maxTs) {
              maxTs = ts;
            }
          }
        }
      } while (params.after);

      this._setAfter(maxTs);
    },
  },
};
