import daktela from "../../daktela.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "daktela-updated-ticket",
  name: "Updated Ticket",
  description: "Emit new event when an existing ticket is updated. [See the documentation](https://customer.daktela.com/apihelp/v6/global/general-information)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    daktela,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // Polling every 15 minutes
      },
    },
  },
  methods: {
    _getLastCheckedTime() {
      return this.db.get("lastCheckedTime") || 0;
    },
    _setLastCheckedTime(time) {
      this.db.set("lastCheckedTime", time);
    },
    async _getUpdatedTickets() {
      const currentTime = Date.now();
      const lastCheckedTime = this._getLastCheckedTime();
      const tickets = await this.daktela._makeRequest({
        path: "/tickets",
      });

      // Filter tickets updated since the last checked time
      const updatedTickets = tickets.filter((ticket) => {
        const updatedTime = Date.parse(ticket.updated);
        return updatedTime > lastCheckedTime;
      });

      // Update last checked time to current time
      this._setLastCheckedTime(currentTime);

      return updatedTickets;
    },
  },
  hooks: {
    async deploy() {
      const updatedTickets = await this._getUpdatedTickets();
      for (const ticket of updatedTickets.slice(-50)) {
        this.$emit(ticket, {
          id: ticket.ticket,
          summary: `Updated ticket: ${ticket.title}`,
          ts: Date.parse(ticket.updated),
        });
      }
    },
  },
  async run() {
    const updatedTickets = await this._getUpdatedTickets();
    for (const ticket of updatedTickets) {
      this.$emit(ticket, {
        id: ticket.ticket,
        summary: `Updated ticket: ${ticket.title}`,
        ts: Date.parse(ticket.updated),
      });
    }
  },
};
