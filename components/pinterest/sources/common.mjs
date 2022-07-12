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
    setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    getLastFetchTime() {
      return this.db.get("lastFetchTime") || 0;
    },
    getLastId() {
      return this.db.get("lastId") || 0;
    },
    getResourceFn() {
      throw new Error("getResourceFn() is not implemented!");
    },
    getResourceFnArgs() {
      throw new Error("getResourceFnArgs() is not implemented!");
    },
    getSummary() {
      throw new Error("getSummary() is not implemented!");
    },
    compareFn() {
      throw new Error("getCompareFn() is not implemented!");
    },
  },
  async run() {
    let newLastId = this.getLastId();
    let newLastFetchTime = this.getLastFetchTime();
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: {
        ...this.getResourceFnArgs(),
      },
    });
    for await (const item of resourcesStream) {
      const createdTime = new Date(item.created_at).getTime();
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
      if (newLastId < item.id) {
        newLastId = item.id;
      }
      if (newLastFetchTime < createdTime) {
        newLastFetchTime = createdTime;
      }
    }
    this.setLastFetchTime(newLastFetchTime);
    this.setLastId(newLastId);
  },
};
