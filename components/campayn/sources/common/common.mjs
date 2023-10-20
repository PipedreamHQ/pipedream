import campayn from "../../campayn.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    campayn,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      // emit historical events
      const events = await this.getResources();
      if (!(events?.length > 0)) {
        return;
      }
      if (events?.length > 25) {
        events.length = 25;
      }
      this._setLastId(events[0].id);
      events.reverse().forEach((event) => this.emitEvent(event));
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    emitEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    getResources() {
      throw new Error("getResources is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const lastId = this._getLastId();

    const events = await this.getResources();

    if (!(events?.length > 0)) {
      return;
    }

    for (const event of events) {
      if (event.id <= lastId) {
        break;
      }
      this.emitEvent(event);
    }

    this._setLastId(events[0].id);
  },
};
