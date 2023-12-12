import common from "../common/common.mjs";
import { API_PATH } from "../../common/constants.mjs";

export default {
  ...common,
  key: "hubspot-new-ticket-property-change",
  name: "New Ticket Property Change",
  description: "Emit new event when a specified property is provided or updated on a ticket. [See the docs here](https://developers.hubspot.com/docs/api/crm/tickets)",
  version: "0.0.4",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    property: {
      type: "string",
      label: "Property",
      description: "The ticket property to watch for changes",
      async options() {
        const { results: properties } = await this.hubspot.getProperties("tickets");
        return properties.map((property) => property.name);
      },
    },
  },
  hooks: {},
  methods: {
    ...common.methods,
    getTs(ticket) {
      const history = ticket.propertiesWithHistory[this.property];
      if (!history || !(history.length > 0)) {
        return;
      }
      return Date.parse(history[0].timestamp);
    },
    generateMeta(ticket) {
      const {
        id,
        properties,
      } = ticket;
      const ts = this.getTs(ticket);
      return {
        id: `${id}${ts}`,
        summary: properties[this.property],
        ts,
      };
    },
    isRelevant(ticket, updatedAfter) {
      return !updatedAfter || this.getTs(ticket) > updatedAfter;
    },
    getParams(after) {
      return {
        object: "tickets",
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
    async batchGetTickets(inputs) {
      return this.hubspot.makeRequest(
        API_PATH.CRMV3,
        "/objects/tickets/batch/read",
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
      const { results: properties } = await this.hubspot.getProperties("tickets");
      const propertyNames = properties.map((property) => property.name);
      if (!propertyNames.includes(this.property)) {
        throw new Error(`Property "${this.property}" not supported for Tickets. See Hubspot's default ticket properties documentation - https://knowledge.hubspot.com/tickets/hubspots-default-ticket-properties`);
      }

      const updatedTickets = await this.getPaginatedItems(this.hubspot.searchCRM, params);

      const inputs = updatedTickets.map(({ id }) => ({
        id,
      }));
      // get tickets w/ `propertiesWithHistory`
      const { results } = await this.batchGetTickets(inputs);

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
