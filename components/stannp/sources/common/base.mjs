import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import stannp from "../../stannp.app.mjs";

export default {
  props: {
    stannp,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId = null) {
      this.db.set("lastId", lastId);
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: this.getSummary(event),
        ts: Date.parse(event.created),
      };
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
};
