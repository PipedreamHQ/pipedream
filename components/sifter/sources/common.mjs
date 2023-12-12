import utils from "../common/utils.mjs";

const intervalSeconds = 60 * 10; //ten minutes

export default {
  props: {
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
    getResourceFnArgs() {
      throw new Error("getResourceFnArgs() is not implemented!");
    },
    getResourceKey() {
      throw new Error("getResourceKey() is not implemented!");
    },
    getSummary() {
      throw new Error("getSummary() is not implemented!");
    },
    compareFn() {
      throw new Error("getCompareFn() is not implemented!");
    },
    getDateKey() {
      throw new Error("getDateKey() is not implemented!");
    },
  },
  async run() {
    let newLastFetchTime = this.getLastFetchTime();
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs(),
      resourceKey: this.getResourceKey(),
    });
    for await (const item of resourcesStream) {
      const createdTime = new Date(item[this.getDateKey()]).getTime();
      if (this.compareFn(item)) {
        this.$emit(
          item,
          {
            id: item.number,
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
