import app from "../../aero_workflow.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  methods: {
    setLastComparable(lastComparable) {
      this.db.set("lastComparable", lastComparable);
    },
    getLastComparable() {
      return this.db.get("lastComparable") || 0;
    },
    getResourceFnConfig() {
      throw new Error("getResourceFnConfig() is not implemented!");
    },
    getItem(item) {
      return item;
    },
    getMeta() {
      throw new Error("getMeta() is not implemented!");
    },
    getComparable() {
      throw new Error("getComparable() is not implemented!");
    },
  },
  async run() {
    const lastComparable = this.getLastComparable();
    let newLastComparable = lastComparable;
    const resources = await this.getResourceFnConfig().resourceFn();
    const items = resources?.[this.getResourceFnConfig().resourceKey];
    for await (const resource of items) {
      const item = await this.getItem(resource);
      const comparable = this.getComparable(item);
      if (lastComparable < comparable) {
        this.$emit(
          item,
          this.getMeta(item),
        );
      }
      if (newLastComparable < comparable) {
        newLastComparable = comparable;
      }
    }
    this.setLastComparable(newLastComparable);
  },
};
