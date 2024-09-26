import googleTasks from "../../google_tasks.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    googleTasks,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {},
  methods: {
    _maxQueryResults() {
      return 100;
    },
    _getLastUpdate() {
      return this.db.get("lastUpdate");
    },
    _setLastUpdate(lastUpdate) {
      this.db.set("lastUpdate", lastUpdate);
    },
    emitEvents(events) {
      throw new Error("emitEvents is not implemented", events);
    },
    generateMeta(event) {
      throw new Error("generateMeta is not implemented", event);
    },
    getParams() {
      throw new Error("getParams is not implemented");
    },
  },
};
