import richpanel from "../../richpanel.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "richpanel-new-ticket-status-change",
  name: "New Ticket Status Change",
  description: "Emit a new event when a ticket's status is updated. [See the documentation]()",
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
    eventFilterDesiredStatuses: {
      propDefinition: [
        "richpanel",
        "eventFilterDesiredStatuses",
      ],
    },
  },
  methods: {
    async getLastTimestamp() {
      return this.db.get("last_timestamp") || new Date(0).toISOString();
    },
    async setLastTimestamp(timestamp) {
      await this.db.set("last_timestamp", timestamp);
    },
  },
  hooks: {
    async deploy() {
      const lastTimestamp = await this.getLastTimestamp();
      const tickets = await this.richpanel.listTickets({
        updated_after: lastTimestamp,
        ...(this.eventFilterDesiredStatuses
          ? {
            desired_statuses: this.eventFilterDesiredStatuses.join(","),
          }
          : {}),
        per_page: 50,
        sortKey: "updated_at",
        order: "DESC",
      });

      tickets.reverse().forEach((ticket) => {
        this.$emit(ticket, {
          id: ticket.id,
          summary: `Ticket ${ticket.id} status changed to ${ticket.status}`,
          ts: Date.parse(ticket.updated_at),
        });
      });

      const latestUpdatedAt =
        tickets.length > 0
          ? tickets[0].updated_at
          : new Date().toISOString();
      await this.setLastTimestamp(latestUpdatedAt);
    },
    async activate() {
      // No webhook setup for polling source
    },
    async deactivate() {
      // No webhook teardown for polling source
    },
  },
  async run() {
    const lastTimestamp = await this.getLastTimestamp();
    const tickets = await this.richpanel.listTickets({
      updated_after: lastTimestamp,
      ...(this.eventFilterDesiredStatuses
        ? {
          desired_statuses: this.eventFilterDesiredStatuses.join(","),
        }
        : {}),
      per_page: 100,
      sortKey: "updated_at",
      order: "ASC",
    });

    let newLastTimestamp = lastTimestamp;

    tickets.forEach((ticket) => {
      if (ticket.updated_at > lastTimestamp) {
        this.$emit(ticket, {
          id: ticket.id,
          summary: `Ticket ${ticket.id} status changed to ${ticket.status}`,
          ts: Date.parse(ticket.updated_at),
        });
        if (ticket.updated_at > newLastTimestamp) {
          newLastTimestamp = ticket.updated_at;
        }
      }
    });

    await this.setLastTimestamp(newLastTimestamp);
  },
};
