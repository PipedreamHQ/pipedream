import app from "../big_cartel.app.mjs";
import utils from "../common/utils.mjs";

const intervalSeconds = 60 * 10; //ten minutes

export default {
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds,
      },
    },
    db: "$.service.db",
  },
  methods: {
    setLastFetchTime(lastFetchTime) {
      this.db.set("lastFetchTime", lastFetchTime);
    },
    getLastFetchTime() {
      return this.db.get("lastFetchTime") || 0;
    },
    getResourceFn() {
      throw new Error("getResourceFn() is not implemented!");
    },
    getResourceKey() {
      throw new Error("getResourceKey() is not implemented!");
    },
    getSummary() {
      throw new Error("getSummary() is not implemented!");
    },
    compareFn() {
      throw new Error("compareFn() is not implemented!");
    },
    getDate() {
      return 0;
    },
  },
  async run() {
    let newLastFetchTime = this.getLastFetchTime();
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.getResourceFn(),
      resourceKey: this.getResourceKey(),
    });
    for await (const item of resourcesStream) {
      const createdTime = new Date(this.getDate(item) || 0).getTime();
      if (this.compareFn(item)) {
        this.$emit(
          item,
          {
            id: item.id,
            summary: this.getSummary(item),
            ts: createdTime,
          },
        );
      }
      if (newLastFetchTime < createdTime) {
        newLastFetchTime = createdTime;
      }
    }
    this.setLastFetchTime(newLastFetchTime);
  },
};
