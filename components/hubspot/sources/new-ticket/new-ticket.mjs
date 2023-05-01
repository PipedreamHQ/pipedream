import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-new-ticket",
  name: "New Tickets",
  description: "Emit new event for each new ticket created.",
  version: "0.0.10",
  dedupe: "unique",
  type: "source",
  hooks: {},
  methods: {
    ...common.methods,
    getTs(ticket) {
      return Date.parse(ticket.createdAt);
    },
    generateMeta(ticket) {
      const {
        id,
        properties,
      } = ticket;
      const ts = this.getTs(ticket);
      return {
        id,
        summary: properties.subject,
        ts,
      };
    },
    isRelevant(ticket, createdAfter) {
      return this.getTs(ticket) > createdAfter;
    },
    getParams() {
      return {
        limit: 100,
        sorts: [
          {
            propertyName: "createdate",
            direction: "DESCENDING",
          },
        ],
        object: "tickets",
      };
    },
    async processResults(after, params) {
      await this.searchCRM(params, after);
    },
  },
};
