import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import gettyImages from "../../getty_images.app.mjs";

export default {
  props: {
    gettyImages,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate");
    },
    _setLastDate(date) {
      this.db.set("lastDate", date);
    },
    generateMeta() {
      throw new Error("generateMeta() must be implemented by the source");
    },
    async emitEvent() {
      throw new Error("emitEvent() must be implemented by the source");
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvent(25);
    },
  },
  async run() {
    await this.emitEvent();
  },
};
