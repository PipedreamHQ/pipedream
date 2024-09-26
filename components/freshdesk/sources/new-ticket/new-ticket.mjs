import freshdesk from "../../freshdesk.app.mjs";
import moment from "moment";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "freshdesk-new-ticket",
  name: "New Ticket",
  description: "Emit new notifications when a new ticket is created",
  version: "0.0.2",
  type: "source",
  props: {
    freshdesk,
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll Harvest API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  dedupe: "unique",
  async run() {
    const data = [];
    let lastDateChecked = this.freshdesk.getLastDateChecked(this.db);
    if (!lastDateChecked) {
      lastDateChecked = new Date().toISOString();
      this.freshdesk.setLastDateChecked(this.db, lastDateChecked);
    }
    const formatedDate = lastDateChecked.substr(0, (lastDateChecked + "T").indexOf("T"));
    const tickets = await this.freshdesk.filterTickets({
      query: `"created_at:>'${formatedDate}'"`,
      page: 1,
    });
    for await (const ticket of tickets) {
      data.push(ticket);
    }
    data && data.reverse().forEach((ticket) => {
      this.freshdesk.setLastDateChecked(this.db, ticket.created_at);
      if (moment(ticket.created_at).isAfter(lastDateChecked)) {
        this.$emit(ticket,
          {
            id: ticket.id,
            summary: `Ticket number: ${ticket.id}`,
            ts: Date.parse(ticket.created_at),
          });
      }
    });
  },
};
