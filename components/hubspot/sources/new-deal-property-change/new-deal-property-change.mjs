import common from "../common/common.mjs";
import { API_PATH } from "../../common/constants.mjs";

export default {
  ...common,
  key: "hubspot-new-deal-property-change",
  name: "New Deal Property Change",
  description: "Emit new event when a specified property is provided or updated on a deal. [See the docs here](https://developers.hubspot.com/docs/api/crm/deals)",
  version: "0.0.5",
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
      const { id } = deal;
      const ts = this.getTs(deal);
      return {
        id: `${id}${ts}`,
        summary: `Deal ${id} updated`,
        ts,
      };
    },
    isRelevant(deal, updatedAfter) {
      return !updatedAfter || this.getTs(deal) > updatedAfter;
    },
    getParams(after) {
      return {
        object: "deals",
        limit: 50,
        properties: [
          this.property,
        ],
        sorts: [
          {
            propertyName: "hs_lastmodifieddate",
            direction: "DESCENDING",
          },
        ],
        filterGroups: [
          {
            filters: [
              {
                propertyName: this.property,
                operator: "HAS_PROPERTY",
              },
              {
                propertyName: "hs_lastmodifieddate",
                operator: "GTE",
                value: after,
              },
            ],
          },
        ],
      };
    },
    async batchGetDeals(inputs) {
      return this.hubspot.makeRequest(
        API_PATH.CRMV3,
        "/objects/deals/batch/read",
        {
          method: "POST",
          data: {
            properties: [
              this.property,
            ],
            propertiesWithHistory: [
              this.property,
            ],
            inputs,
          },
        },
      );
    },
    async processResults(after, params) {
      const properties = await this.hubspot.getDealProperties();
      const propertyNames = properties.map((property) => property.name);
      if (!propertyNames.includes(this.property)) {
        throw new Error(`Property "${this.property}" not supported for Deals. See Hubspot's default deal properties documentation - https://knowledge.hubspot.com/crm-deals/hubspots-default-deal-properties`);
      }

      const updatedDeals = await this.getPaginatedItems(this.hubspot.searchCRM, params);

      if (!updatedDeals.length) {
        return;
      }

      const inputs = updatedDeals.map(({ id }) => ({
        id,
      }));
      // get deals w/ `propertiesWithHistory`
      const { results } = await this.batchGetDeals(inputs);

      let maxTs = after;
      for (const result of results) {
        if (this.isRelevant(result, after)) {
          this.emitEvent(result);
          const ts = this.getTs(result);
          if (ts > maxTs) {
            maxTs = ts;
          }
        }
      }

      this._setAfter(maxTs);
    },
  },
};
