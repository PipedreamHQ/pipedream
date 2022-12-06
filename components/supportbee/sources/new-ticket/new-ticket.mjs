import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Ticket",
  version: "0.0.2",
  key: "supportbee-new-ticket",
  description: "Emit new event on each new ticket.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New ticket with id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
    getResources(args = {}) {
      return this.supportbee.getTickets(args);
    },
  },
};
