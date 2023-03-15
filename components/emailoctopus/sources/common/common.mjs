import app from "../../emailoctopus.app.mjs";
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
    setLastCreatedTime(lastCreatedTime) {
      this.db.set("lastCreatedTime", lastCreatedTime);
    },
    getLastCreatedTime() {
      return this.db.get("lastCreatedTime") || 0;
    },
    setIds(ids) {
      this.db.set("ids", ids);
    },
    getIds() {
      return this.db.get("ids") || [];
    },
    getComparisonType() {
      return "last";
    },
    getResourceFn() {
      throw new Error("getResourceFn() is not implemented!");
    },
    getResourceFnParams() {
      throw new Error("getResourceFnParams() is not implemented!");
    },
    getItem() {
      throw new Error("getItem() is not implemented!");
    },
    getMeta() {
      throw new Error("getMeta() is not implemented!");
    },
  },
  async run() {
    const items = [], comparison = this.getComparisonType();
    const resources = this.app.paginate({
      fn: this.getResourceFn(),
      params: this.getResourceFnParams(),
    });
    for await (const item of resources) {
      items.push(item);
    }
    if (comparison == "last") {
      let lastCreatedTime = this.getLastCreatedTime();
      let newLastCreatedTime = lastCreatedTime;
      for (let item of items) {
        const createdTime = new Date(item.created_at).getTime();
        if (lastCreatedTime < createdTime) {
          let detailedItem = await this.getItem(item);
          this.$emit(detailedItem, this.getMeta(detailedItem));
        }
        if (newLastCreatedTime < createdTime) {
          newLastCreatedTime = createdTime;
        }
        this.setLastCreatedTime(newLastCreatedTime);
      }
    } else if (comparison == "include") {
      let ids = this.getIds();
      for (let item of items) {
        if (!ids.includes(item.id)) {
          let detailedItem = await this.getItem(item);
          ids.push(item.id);
          this.$emit(detailedItem, this.getMeta(detailedItem));
        }
      }
      this.setIds(ids);
    }
  },
};
