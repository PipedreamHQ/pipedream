import app from "../../order_desk.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _monthAgo() {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      return date.toISOString();
    },
    _getLastFetchDate() {
      return this.db.get("lastFetchDate")
        ? new Date(this.db.get("lastFetchDate")).toISOString()
        : this._monthAgo();
    },
    _setLastFetchDate(date) {
      this.db.set("lastFetchDate", date);
    },
    async fetchEvents() {
      const params = this.getParams();
      const data = [];
      let page = 0;
      while (true) {
        const res = await this.app.listOrders(page, params);
        if (res.orders.length === 0) {
          break;
        }
        data.push(...res.orders);
        page++;
      }
      this._setLastFetchDate(Date.now());
      return data;
    },
    emit(event) {
      const meta = this.getMeta(event);
      this.$emit(event, meta);
    },
    getParams() {
      throw new Error("getParams is not implemented");
    },
    getMeta() {
      throw new Error("getMeta is not implemented");
    },
  },
  async run() {
    const events = await this.fetchEvents();
    for (const event of events.reverse()) {
      this.emit(event);
    }
  },
};
