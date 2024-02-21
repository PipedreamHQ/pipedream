import knowfirst from "../../knowfirst.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "knowfirst-new-feed-list-event",
  name: "New Feed List Event",
  description: "Emit new event when a new event for the specified business appears in your feed.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    knowfirst,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    businessId: {
      propDefinition: [
        knowfirst,
        "businessId",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastTime() {
      return this.db.get("lastTime");
    },
    _setLastTime(lastTime) {
      this.db.set("lastTime", lastTime);
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: item.title,
        ts: Date.parse(item.time),
      };
    },
    async processEvent(max) {
      const lastTime = this._getLastTime();
      const params = {};
      if (this.businessId) {
        params.business_id = this.businessId;
      }
      if (lastTime) {
        params["time[gt]"] = lastTime;
      }
      const results = this.knowfirst.paginate({
        resourceFn: this.knowfirst.getFeed,
        params,
        max,
      });
      const items = [];
      for await (const item of results) {
        items.push(item);
      }
      if (!items.length) {
        return;
      }
      this._setLastTime(items[0].time);
      items.forEach((item) => this.emitEvent(item));
    },
  },
  async run() {
    await this.processEvent();
  },
};
