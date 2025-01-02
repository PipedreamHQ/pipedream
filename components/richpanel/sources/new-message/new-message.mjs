import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "richpanel-new-message",
  name: "New Message in Richpanel Ticket",
  description: "Emit new event when a customer sends a new message on an existing or new ticket. Optionally filter by channel (e.g., email, chat).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getDateField() {
      return "updated_at";
    },
    getSummary(item) {
      return `New message on ticket ${item.id}`;
    },
  },
  sampleEmit,
};
