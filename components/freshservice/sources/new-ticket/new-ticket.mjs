import moment from "moment";
import freshservice from "../../freshservice.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Ticket",
  version: "0.0.3",
  key: "freshservice-new-ticket",
  description: "Emit new event for each created ticket. [See documentation](https://api.freshservice.com/v2/#list_all_tickets)",
  type: "source",
  dedupe: "unique",
  props: {
    freshservice,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New ticket: ${data.subject || data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
    async *getTickets(params = {}) {
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const { tickets } = await this.freshservice.filterTickets({
          params: {
            ...params,
            page,
            per_page: 100,
          },
        });

        if (!tickets || tickets.length === 0) {
          hasMore = false;
        } else {
          for (const ticket of tickets) {
            yield ticket;
          }
          page++;
        }
      }
    },
    async emitEvents() {
      const lastDateChecked = await this.freshservice.getLastDateChecked();
      const formattedDate = moment(lastDateChecked).format("YYYY-MM-DDTHH:mm:ss[Z]");

      const params = {
        query: `"created_at:>'${formattedDate}'"`,
        order_by: "created_at",
        order_type: "asc",
      };

      let maxCreatedAt = lastDateChecked;

      for await (const ticket of this.getTickets(params)) {
        this.emitEvent(ticket);

        if (ticket.created_at > maxCreatedAt) {
          maxCreatedAt = ticket.created_at;
        }
      }

      await this.freshservice.setLastDateChecked(maxCreatedAt);
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvents();
    },
  },
  async run() {
    await this.emitEvents();
  },
};
