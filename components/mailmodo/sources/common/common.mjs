import app from "../../mailmodo.app.mjs";
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
    setLastCretatedTime(lastCretatedTime) {
      this.db.set("lastCretatedTime", lastCretatedTime);
    },
    getLastCretatedTime() {
      return this.db.get("lastCretatedTime") || 0;
    },
    getResourceFn() {
      throw new Error("getResourceFn() is not implemented!");
    },
    getResourceKey() {
      throw new Error("getResourceKey() is not implemented!");
    },
    getResourceFnArgs() {
      return {};
    },
    getSummary() {
      throw new Error("getSummary() is not implemented!");
    },
  },
  async run() {
    let lastCretatedTime = this.getLastCretatedTime();
    let newLastCreatedTime = lastCretatedTime;
    const resp = await this.getResourceFn()({
      ...this.getResourceFnArgs(),
    });
    const resources = this.getResourceKey()
      .split(".")
      .reduce((acc, curr) => acc?.[curr], resp);
    for (const item of resources) {
      const createdTime = new Date(item.created_at).getTime();
      if (lastCretatedTime < createdTime) {
        this.$emit(
          item,
          {
            id: createdTime,
            summary: this.getSummary(item),
            ts: createdTime,
          },
        );
      }
      if (newLastCreatedTime < createdTime) {
        newLastCreatedTime = createdTime;
      }
    }
    this.setLastCretatedTime(newLastCreatedTime);
  },
};
