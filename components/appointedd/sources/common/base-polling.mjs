import appointedd from "../../appointedd.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    appointedd,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Trello API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    filterRelevantItems(items) {
      return items;
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      const resourceFn = this.getResourceFn();
      const params = this.getParams(lastTs);

      const results = this.appointedd.paginate({
        resourceFn,
        params,
        max,
      });
      const items = [];
      for await (const item of results) {
        items.push(item);
      }
      if (!items.length) {
        return;
      }
      this._setLastTs(items[0][this.getTsField()]);
      const relevantItems = this.filterRelevantItems(items);
      relevantItems.reverse().forEach((item) => this.emitEvent(item));
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getParams() {
      throw new Error("getParams is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    await this.processEvent();
  },
};
