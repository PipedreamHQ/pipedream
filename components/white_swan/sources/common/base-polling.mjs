import whiteSwan from "../../white_swan.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    whiteSwan,
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
      await this.processEvent(25);
    },
  },
  methods: {
    _getPreviousItems() {
      return this.db.get("previousItems") || {};
    },
    _setPreviousItems(previousItems) {
      this.db.set("previousItems", previousItems);
    },
    async processEvent(max) {
      const previousItems = this._getPreviousItems();
      const resourceFn = this.getResourceFn();
      const items = await resourceFn();
      if (!items?.length) {
        return;
      }
      let count = 0;
      for (const item of items) {
        const itemKey = this.getItemKey(item);
        if (!previousItems[itemKey]) {
          const meta = this.generateMeta(item);
          this.$emit(item, meta);
          previousItems[itemKey] = true;
          count++;
          if (max && count >= max) {
            break;
          }
        }
      }
      this._setPreviousItems(previousItems);
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getItemKey() {
      throw new Error("getItemKey is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    await this.processEvent();
  },
};
