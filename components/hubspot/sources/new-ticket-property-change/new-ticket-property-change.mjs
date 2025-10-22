import { DEFAULT_LIMIT } from "../../common/constants.mjs";
import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-ticket-property-change",
  name: "New Ticket Property Change",
  description:
    "Emit new event when a specified property is provided or updated on a ticket. [See the documentation](https://developers.hubspot.com/docs/api/crm/tickets)",
  version: "0.0.30",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    property: {
      type: "string",
      label: "Property",
      description: "The ticket property to watch for changes",
      async options() {
        const properties = await this.getWriteOnlyProperties("tickets");
        return properties.map((property) => property.name);
      },
    },
  },
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
        id, properties,
      } = ticket;
      const ts = this.getTs(ticket);
      return {
        id: `${id}${ts}`,
        summary: properties[this.property],
        ts,
      };
    },
    isRelevant(ticket, updatedAfter) {
      return this.getTs(ticket) > updatedAfter;
    },
    getParams(after) {
      const params = {
        object: "tickets",
        data: {
          limit: DEFAULT_LIMIT,
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
              ],
            },
          ],
        },
      };
      if (after) {
        params.data.filterGroups[0].filters.push({
          propertyName: "hs_lastmodifieddate",
          operator: "GTE",
          value: after,
        });
      }
      return params;
    },
    batchGetTickets(inputs) {
      return this.hubspot.batchGetObjects({
        objectType: "tickets",
        data: {
          properties: [
            this.property,
          ],
          propertiesWithHistory: [
            this.property,
          ],
          inputs,
        },
      });
    },
    async processResults(after, params) {
      const properties = await this.getWriteOnlyProperties("tickets");
      const propertyNames = properties.map((property) => property.name);

      if (!propertyNames.includes(this.property)) {
        throw new Error(
          `Property "${this.property}" not supported for Tickets. See Hubspot's default ticket properties documentation - https://knowledge.hubspot.com/tickets/hubspots-default-ticket-properties`,
        );
      }

      const updatedTickets = await this.getPaginatedItems(
        this.hubspot.searchCRM,
        params,
        after,
      );

      if (!updatedTickets.length) {
        return;
      }

      const results = await this.processChunks({
        batchRequestFn: this.batchGetTickets,
        chunks: this.getChunks(updatedTickets),
      });

      this.processEvents(results, after);
    },
  },
  sampleEmit,
};
