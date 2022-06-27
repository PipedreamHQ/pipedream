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
  async run({ $ }) {
    const firstRun = this.getLastId() == 0;
    let newLastId = this.getLastId();
    this.setLastFetchTime(Date.now() - intervalSeconds * 1000);
    const resourcesStream = await utils.getResourcesStream({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: {
        $,
        ...this.getResourceFnArgs(),
      },
    });
    for await (const item of resourcesStream) {
      const createdTime = new Date(item.created_at).getTime();
      if (!firstRun && this.compareFn(item)) {
        this.$emit(
          {
            item,
          },
          {
            id: item.id,
            summary: this.getSummary(),
            ts: createdTime,
          },
        );
      }
      if (newLastId < item.id) {
        newLastId = item.id;
      }
    }
    this.setLastId(newLastId);
  },
};
