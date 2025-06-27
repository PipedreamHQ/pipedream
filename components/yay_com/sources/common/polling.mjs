import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import yayCom from "../../yay_com.app.mjs";

export default {
  props: {
    yayCom,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getSavedIds() {
      return this.db.get("savedIds") || [];
    },
    _setSavedIds(ids) {
      this.db.set("savedIds", ids);
    },
    async startEvent(maxItems) {
      const savedIds = this._getSavedIds();
      const items = await this.getItems(savedIds);

      const newIds = [];
      for (const item of items) {
        const id = this.getItemId(item);
        if (!savedIds.includes(id)) {
          const meta = this.generateMeta(item);
          if (maxItems === undefined || (typeof maxItems === "number" && --maxItems >= 0)) {
            this.$emit(item, meta);
          }
          newIds.push(id);
        }
      }

      if (newIds.length > 0) {
        // Keep only the most recent IDs to prevent the array from growing indefinitely
        const ids = [
          ...savedIds,
          ...newIds,
        ].slice(-100);
        this._setSavedIds(ids);
      }
    },
  },
  async run() {
    await this.startEvent();
  },
  hooks: {
    async deploy() {
      await this.startEvent(5);
    },
  },
};
