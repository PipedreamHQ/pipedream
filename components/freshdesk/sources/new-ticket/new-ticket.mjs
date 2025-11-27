import common from "../common/polling.mjs";

export default {
  ...common,
  key: "freshdesk-new-ticket",
  name: "New Ticket Created",
  description: "Emit new event when a ticket is created. [See the documentation](https://developers.freshdesk.com/api/#filter_tickets)",
  version: "0.0.9",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.freshdesk.filterTickets;
    },
    getTsField() {
      return "created_at";
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New Ticket (ID: ${item.id})`,
        ts: Date.parse(item.created_at),
      };
    },
  },
};
