import app from "../../kanban_tool.app.mjs";
import utils from "../../common/utils.mjs";
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
    setIds(ids) {
      this.db.set("ids", ids);
    },
    getIds() {
      return this.db.get("ids") || [];
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
    compareFn() {
      return true;
    },
  },
  async run() {
    const lastComparable = this.getLastComparable();
    let newLastComparable = lastComparable;
    const resourcesStream = utils.getResourcesStream({
      ...this.getResourceFnConfig(),
    });
    for await (const resource of resourcesStream) {
      const item = await this.getItem(resource);
      const comparable = this.getComparable(item);
      if (lastComparable < comparable && this.compareFn(item)) {
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
