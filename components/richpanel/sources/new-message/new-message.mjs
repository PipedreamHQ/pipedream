import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "richpanel-new-message",
  name: "New Message in Ticket",
  description: "Emit new event when a new message is sent on an existing or new ticket.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getDateField() {
      return "updatedAt";
    },
    getSummary(item) {
      return `New message on ticket ${item.id}`;
    },
    async prepareData(data, lastDate) {
      const response = [];
      for await (const item of data) {
        for (const message of item.comments) {
          if (Date.parse(message.created_at) > Date.parse(lastDate)) {
            response.push({
              ...message,
              updated_at: message.created_at,
              ticket_id: item.id,
            });
          }
        }
      }
      return response;
    },
  },
  sampleEmit,
};
