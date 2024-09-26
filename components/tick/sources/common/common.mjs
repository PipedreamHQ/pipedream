import tick from "../../tick.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    tick,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    getResourceMethod() {
      throw new Error("getResourceMethod is not implemented");
    },
    emitEvent(event) {
      throw new Error("emitEvent is not implemented", event);
    },
    _setLastSincedTimestamp() {
      this.db.set("lastSincedTimestamp", new Date().toISOString());
    },
    _getLastSincedTimestamp() {
      return this.db.get("lastSincedTimestamp");
    },
  },
  hooks: {
    async deploy() {
      this._setLastSincedTimestamp();

      const resources = await (this.getResourceMethod())({
        params: {
          updated_at: "2022-08-16",
        },
      });

      resources.forEach(this.emitEvent);
    },
  },
  async run() {
    let page = 0;

    const lastSincedTimestamp = this._getLastSincedTimestamp();
    this._setLastSincedTimestamp();

    while (page >= 0) {
      const resources = await (this.getResourceMethod())({
        params: {
          page,
          updated_at: lastSincedTimestamp,
        },
      });

      resources.forEach(this.emitEvent);

      if (resources.length < 100) {
        return;
      }

      page++;
    }
  },
};
