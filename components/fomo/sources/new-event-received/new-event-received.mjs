import fomo from "../../fomo.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Event Received",
  version: "0.0.1",
  key: "fomo-new-event-received",
  description: "Emit new event on each new site event received.",
  type: "source",
  dedupe: "unique",
  props: {
    fomo,
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
        summary: `New event received with ID ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
    _setLastSyncDate(date) {
      this.db.set("lastSyncDate", date);
    },
    _getLastSyncDate() {
      return this.db.get("lastSyncDate");
    },
  },
  hooks: {
    async deploy() {
      const events = await this.fomo.getEvents({
        params: {
          per_page: 10,
          order_by: "created_at",
          order_direction: "desc",
        },
      });

      events.forEach(this.emitEvent);
    },
  },
  async run() {
    const lastSyncDate = this._getLastSyncDate() ?? (new Date).getTime();
    this._setLastSyncDate((new Date).getTime());

    let page = 1;

    while (true) {
      const events = await this.fomo.getEvents({
        params: {
          page,
          per_page: 100,
          order_by: "created_at",
          order_direction: "desc",
        },
      });

      events
        .filter((event) => Date.parse(event.created_at) > lastSyncDate)
        .forEach(this.emitEvent);

      if (
        events.length < 100 ||
        !events.filter((event) => Date.parse(event.created_at) > lastSyncDate).length
      ) {
        break;
      }

      page++;
    }
  },
};
