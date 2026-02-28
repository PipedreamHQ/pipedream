import common from "../common/polling.mjs";

export default {
  ...common,
  key: "freshdesk-ticket-updated",
  name: "Ticket Updated",
  description: "Emit new event when a ticket is updated. [See the documentation](https://developers.freshdesk.com/api/#filter_tickets)",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.freshdesk.filterTickets;
    },
    getTsField() {
      return "updated_at";
    },
    generateMeta(item) {
      const ts = Date.parse(item.updated_at);
      return {
        id: `${item.id}-${ts}`,
        summary: `Ticket Updated (ID: ${item.id})`,
        ts,
      };
    },
  },
};
