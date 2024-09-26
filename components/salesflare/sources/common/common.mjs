import app from "../../salesflare.app.mjs";
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
    setLastCretatedTime(lastCretatedTime) {
      this.db.set("lastCretatedTime", lastCretatedTime);
    },
    getLastCretatedTime() {
      return this.db.get("lastCretatedTime") || 0;
    },
    getResourceFn() {
      throw new Error("getResourceFn() is not implemented!");
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
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs(),
    });
    for await (const item of resourcesStream) {
      const createdTime = new Date(item.creation_date).getTime();
      if (lastCretatedTime < createdTime) {
        this.$emit(
          item,
          {
            id: item.id,
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
