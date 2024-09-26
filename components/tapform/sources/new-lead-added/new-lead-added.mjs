import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import tapform from "../../tapform.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "tapform-new-lead-added",
  name: "New Lead Added",
  description: "Emit new event when a lead is added to Tapform.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    tapform,
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
      return this.db.get("lastDate") || "1970-01-01T00:00:00.001Z";
    },
    _setLastDate(created) {
      this.db.set("lastDate", created);
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New lead added with Id: ${item.id}`,
        ts: item.createdAt,
      };
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();
      const data = await this.tapform.listLeads();
      let count = 0;

      const responseArray = [];
      for (const item of data) {
        if (Date.parse(item.createdAt) <= Date.parse(lastDate)) break;
        if (maxResults && (maxResults <= ++count)) break;
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastDate(responseArray[0].createdAt);

      for (const item of responseArray.reverse()) {
        this.$emit(item, this.generateMeta(item));
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
