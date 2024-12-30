import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import richpanel from "../../richpanel.app.mjs";

export default {
  key: "richpanel-new-message",
  name: "New Message in Richpanel Ticket",
  description: "Emit new event when a customer sends a new message on an existing or new ticket. Optionally filter by channel (e.g., email, chat). [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    richpanel,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    eventFilterChannel: {
      propDefinition: [
        richpanel,
        "eventFilterChannel",
      ],
    },
  },
  hooks: {
    async deploy() {
      const currentTimestamp = Date.now();
      await this.db.set("lastProcessedTimestamp", currentTimestamp);
    },
    async activate() {
      // Optionally, log authentication keys or set up webhooks if required
      this.richpanel.authKeys();
    },
    async deactivate() {
      // Optionally, clean up any resources or log deactivation
      console.log("Deactivated richpanel-new-message source.");
    },
  },
  async run() {
    const ticketsResponse = await this.richpanel.listTickets();

    if (!ticketsResponse || !ticketsResponse.tickets) {
      return;
    }

    const tickets = ticketsResponse.tickets;
    let lastProcessedTimestamp = await this.db.get("lastProcessedTimestamp") || 0;
    let newMessages = [];

    for (const ticket of tickets) {
      if (ticket.comments && Array.isArray(ticket.comments)) {
        for (const comment of ticket.comments) {
          const messageTimestamp = Date.parse(comment.created_at) || Date.now();

          if (messageTimestamp > lastProcessedTimestamp && comment.sender_type === "customer") {
            // Optionally, filter by channel
            if (this.eventFilterChannel && !this.eventFilterChannel.includes(comment.via.channel)) {
              continue;
            }

            newMessages.push({
              ...comment,
              ticket_id: ticket.id,
            });
          }
        }
      }
    }

    if (newMessages.length > 0) {
      for (const message of newMessages) {
        this.$emit(message, {
          id: message.id || message.ts,
          summary: `New message on ticket ${message.ticket_id}`,
          ts: Date.parse(message.created_at) || Date.now(),
        });
      }

      // Update lastProcessedTimestamp to the latest message's timestamp
      const latestTimestamp = Math.max(...newMessages.map((msg) => Date.parse(msg.created_at) || Date.now()));
      await this.db.set("lastProcessedTimestamp", latestTimestamp);
    }
  },
};
