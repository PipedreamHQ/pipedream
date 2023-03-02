import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-new-ticket-property-change",
  name: "New Ticket Property Change",
  description: "Emit new event when a specified property is provided or updated on a ticket.",
  version: "0.0.1",
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
        summary: properties.subject,
        ts,
      };
    },
    isRelevant(ticket, updatedAfter) {
      return !updatedAfter || this.getTs(ticket) > updatedAfter;
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
      const { results } = await this.hubspot.listObjectsInPage("tickets", null, params);

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
