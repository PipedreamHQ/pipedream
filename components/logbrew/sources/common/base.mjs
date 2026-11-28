import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import logbrew from "../../logbrew.app.mjs";

export default {
  props: {
    logbrew,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    projectId: {
      propDefinition: [
        logbrew,
        "projectId",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.emitNew({
        max: 10,
      });
    },
  },
  methods: {
    _getCursor() {
      return this.db.get("cursor");
    },
    _setCursor(cursor) {
      this.db.set("cursor", cursor);
    },
    getItems() {
      throw new Error("getItems is not implemented");
    },
    getTimestamp() {
      throw new Error("getTimestamp is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    async emitNew({ max } = {}) {
      const startedAt = new Date().toISOString();
      const cursor = this._getCursor();
      const since = cursor
        ? Date.parse(cursor)
        : 0;
      const items = (await this.getItems(cursor))
        .filter((item) => Date.parse(this.getTimestamp(item)) > since)
        .sort((a, b) => Date.parse(this.getTimestamp(a)) - Date.parse(this.getTimestamp(b)));
      const emitted = max
        ? items.slice(-max)
        : items;
      for (const item of emitted) {
        this.$emit(item, this.generateMeta(item));
      }
      if (!cursor) {
        this._setCursor(startedAt);
        return;
      }
      const newest = items.at(-1);
      this._setCursor(newest
        ? this.getTimestamp(newest)
        : cursor);
    },
  },
  async run() {
    await this.emitNew();
  },
};
