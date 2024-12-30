import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import richpanel from "../../richpanel.app.mjs";

export default {
  key: "richpanel-new-ticket",
  name: "New Support Ticket Created",
  description: "Emit a new event when a support ticket is created. [See the documentation]()",
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
    eventFilterStatus: {
      propDefinition: [
        "richpanel",
        "eventFilterStatus",
      ],
    },
    eventFilterPriority: {
      propDefinition: [
        "richpanel",
        "eventFilterPriority",
      ],
    },
    eventFilterAssignedAgent: {
      propDefinition: [
        "richpanel",
        "eventFilterAssignedAgent",
      ],
    },
  },
  hooks: {
    async deploy() {
      const tickets = await this.richpanel.listTickets({
        page: 1,
        per_page: 50,
        status: this.eventFilterStatus,
        priority: this.eventFilterPriority,
        assignee_id: this.eventFilterAssignedAgent,
      });
      const sortedTickets = tickets.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );
      for (const ticket of sortedTickets) {
        this.$emit(ticket, {
          id: ticket.id || Date.parse(ticket.created_at),
          summary: `New Ticket: ${ticket.subject}`,
          ts: Date.parse(ticket.created_at) || Date.now(),
        });
      }
      const latestTicket = tickets[0];
      const lastTimestamp = latestTicket
        ? Date.parse(latestTicket.created_at)
        : Date.now();
      await this.db.set("lastTimestamp", lastTimestamp);
    },
    async activate() {
      await this.richpanel.createWebhook({
        url: this.webhookUrl,
        event: "ticket_created",
        filters: {
          status: this.eventFilterStatus,
          priority: this.eventFilterPriority,
          assignee_id: this.eventFilterAssignedAgent,
        },
      });
    },
    async deactivate() {
      await this.richpanel.deleteWebhook({
        event: "ticket_created",
      });
    },
  },
  async run() {
    const lastTimestamp = (await this.db.get("lastTimestamp")) || 0;
    const tickets = await this.richpanel.listTickets({
      per_page: 100,
      status: this.eventFilterStatus,
      priority: this.eventFilterPriority,
      assignee_id: this.eventFilterAssignedAgent,
      since: new Date(lastTimestamp).toISOString(),
    });

    const newTickets = tickets.filter(
      (ticket) => Date.parse(ticket.created_at) > lastTimestamp,
    );

    const sortedNewTickets = newTickets.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at),
    );

    for (const ticket of sortedNewTickets) {
      this.$emit(ticket, {
        id: ticket.id || Date.parse(ticket.created_at),
        summary: `New Ticket: ${ticket.subject}`,
        ts: Date.parse(ticket.created_at) || Date.now(),
      });
    }

    if (sortedNewTickets.length > 0) {
      const latestTicket = sortedNewTickets[sortedNewTickets.length - 1];
      const newLastTimestamp = Date.parse(latestTicket.created_at);
      await this.db.set("lastTimestamp", newLastTimestamp);
    }
  },
};
