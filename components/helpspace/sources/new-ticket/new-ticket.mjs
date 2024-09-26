import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "helpspace-new-ticket",
  name: "New Ticket (Instant)",
  description: "Emit new event when a new ticket is opened in HelpSpace. Note: Users may only have one active Helpspace webhook at a time. [See the documentation](https://documentation.helpspace.com/article/340/webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTrigger() {
      const baseTrigger = this.getBaseTrigger();
      return {
        ...baseTrigger,
        ticket: {
          ...baseTrigger.ticket,
          created: true,
        },
      };
    },
    generateMeta(ticket) {
      return {
        id: ticket.id,
        summary: `New Ticket ${ticket.subject}`,
        ts: Date.parse(ticket.created_at),
      };
    },
  },
  sampleEmit,
};
