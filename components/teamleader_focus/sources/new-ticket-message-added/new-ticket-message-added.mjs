import common from "../common/common.mjs";

export default {
  ...common,
  key: "teamleader_focus-new-ticket-message-added",
  name: "New Ticket Message Added (Instant)",
  description: "Emit new event for each message added to a ticket. [See the documentation](https://developer.focus.teamleader.eu/docs/api/webhooks-register)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents() {
      return [];
    },
    getEventTypes() {
      return [
        "ticketMessage.added",
      ];
    },
    async getResource(body) {
      const messageId = body.subject.id;
      const { data } = await this.teamleaderFocus.getTicketMessage({
        data: {
          message_id: messageId,
        },
      });
      return data;
    },
    generateMeta(message) {
      const ts = Date.parse(message.created_at) || Date.now();
      return {
        id: message.message_id,
        summary: "New Message Added to Ticket",
        ts,
      };
    },
  },
};
