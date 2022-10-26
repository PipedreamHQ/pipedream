import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-new-ticket",
  name: "New Tickets",
  description: "Emit new event for each new ticket created.",
  version: "0.0.3",
  dedupe: "unique",
  type: "source",
  hooks: {},
  methods: {
    ...common.methods,
    generateMeta(ticket) {
      const {
        id,
        properties,
        createdAt,
      } = ticket;
      const ts = Date.parse(createdAt);
      return {
        id,
        summary: properties.subject,
        ts,
      };
    },
    isRelevant(ticket, createdAfter) {
      return Date.parse(ticket.createdAt) > createdAfter;
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
