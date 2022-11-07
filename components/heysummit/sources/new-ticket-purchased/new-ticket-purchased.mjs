import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Ticket Purchased",
  version: "0.0.1",
  key: "heysummit-new-ticket-purchased",
  description: "Emit new event when a ticket is purchased.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      if (this.eventId && +data.event_id !== +this.eventId) {
        return;
      }

      this.$emit(data, {
        id: data.id,
        summary: `New ticket purchased with id ${data.id}`,
        ts: new Date(),
      });
    },
    getResources(args = {}) {
      return this.heysummit.getTickets(args);
    },
  },
};
