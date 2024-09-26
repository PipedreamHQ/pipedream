import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import discogs from "../../discogs.app.mjs";

export default {
  props: {
    discogs,
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
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", Date.parse(lastDate));
    },
    async startEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const items = this.discogs.paginate({
        fn: this.discogs.listOrders,
        maxResults,
        params: {
          status: this.getStatus(),
          sort: "last_activity",
          sort_order: "desc",
        },
      });

      let orders = [];

      for await (const item of items) {
        if (Date.parse(item.last_activity) <= lastDate) break;
        orders.push(item);
      }
      if (orders.length) this._setLastDate(orders[0].last_activity);

      orders.reverse().forEach((order) => {
        this.$emit(order, {
          id: order.id,
          summary: this.getSummary(order.id),
          ts: Date.parse(order.last_activity),
        });
      });
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
};
