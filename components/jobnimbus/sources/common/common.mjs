import app from "../../jobnimbus.app.mjs";
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
    let lastComparable = this.getLastComparable();
    const resourcesStream = utils.getResourcesStream(this.getResourceFnConfig());
    for await (const resource of resourcesStream) {
      const comparable = this.getComparable(resource);
      if (lastComparable < comparable && this.compareFn(resource)) {
        const item = await this.getItem(resource);
        this.$emit(
          item,
          this.getMeta(item),
        );
      }
      if (lastComparable < comparable) {
        lastComparable = comparable;
      }
    }
    this.setLastComparable(lastComparable);
  },
};
