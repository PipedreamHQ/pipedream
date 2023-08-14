import app from "../../freshservice.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Ticket",
  version: "0.0.2",
  key: "freshservice-new-ticket",
  description: "Emit new event for each created ticket. [See documentation](https://api.freshservice.com/#view_all_ticket)",
  type: "source",
  dedupe: "unique",
  props: {
    app,
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
        summary: `New ticket with ID ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
    async emitEvents() {
      const { tickets: resources } = await this.app.getTickets({
        params: {
          filter: "new_and_my_open",
          order_type: "desc",
        },
      });

      resources.reverse().forEach(this.emitEvent);
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
