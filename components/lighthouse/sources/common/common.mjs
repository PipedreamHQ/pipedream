import lighthouse from "../../lighthouse.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    lighthouse,
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
      throw Error("emitEvent is not implemented", data);
    },
    async getResources(args = {}) {
      throw Error("getResources is not implemented", args);
    },
    resourceKey() {
      throw Error("resourceKey is not implemented");
    },
    _setLastTimeSynced(date) {
      this.db.set("lastTimeSynced", date);
    },
    _getLastTimeSynced() {
      return this.db.get("lastTimeSynced");
    },
  },
  hooks: {
    async deploy() {
      const resources = await this.getResources();

      resources.slice(-10).reverse()
        .forEach(this.emitEvent);
    },
  },
  async run() {
    const lastTimeSynced = this._getLastTimeSynced() ?? (new Date).getTime();
    this._setLastTimeSynced((new Date).getTime());

    const resources = await this.getResources();

    resources.filter((resource) =>
      Date.parse(resource[this.resourceKey()].created_at) >= lastTimeSynced)
      .reverse()
      .forEach(this.emitEvent);
  },
};
