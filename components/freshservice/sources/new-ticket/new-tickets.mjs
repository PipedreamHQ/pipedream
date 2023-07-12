import app from "../../freshservice.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Ticket",
  version: "0.0.1",
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
    _setLastResourceId(id) {
      this.db.set("lastResourceId", id);
    },
    _getLastResourceId() {
      return this.db.get("lastResourceId");
    },
  },
  hooks: {
    async deploy() {
      const { tickets: resources } = await this.app.getTickets({
        params: {
          filter: "new_and_my_open",
          order_type: "desc",
        },
      });

      if (resources.length) {
        this._setLastResourceId(resources[0].id)
      }

      resources.reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    const lastResourceId = this._getLastResourceId();

    const { tickets: resources } = await this.app.getTickets({
      params: {
        filter: "new_and_my_open",
        order_type: "desc",
      },
    });

    if (resources.length) {
      this._setLastResourceId(resources[0].id)
    }

    resources.reverse().forEach(this.emitEvent);

    if (resources.filter((resource) => resource.id === lastResourceId)) {
      return;
    }
  },
};
