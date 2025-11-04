import eventbrite from "../../eventbrite.app.mjs";
import common from "../common/base.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  ...common,
  key: "eventbrite-new-order-placed-by-me",
  name: "New Order Placed By Me",
  description: "Emit new event when the authenticated user places a new order in Eventbrite",
  version: "0.0.2",
  dedupe: "unique",
  type: "source",
  props: {
    eventbrite,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const orderStream = await this.resourceStream(
        this.eventbrite.listUserOrders.bind(this),
        "orders",
      );
      const orders = [];
      for await (const order of orderStream) {
        orders.push(order);
      }
      if (!orders.length) {
        return;
      }
      this._setLastTs(Date.parse(orders[orders.length - 1].created));
      const newestOrders = orders.reverse().slice(0, 25);
      newestOrders.forEach((order) => this.emitEvent(order));
    },
  },
  methods: {
    ...common.methods,
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    generateMeta(order) {
      return {
        id: order.id,
        summary: `New Order with ID ${order.id}`,
        ts: Date.parse(order.created),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxLastTs = lastTs;

    const orderStream = await this.resourceStream(
      this.eventbrite.listUserOrders.bind(this),
      "orders",
    );
    for await (const order of orderStream) {
      const ts = Date.parse(order.created);
      if (ts > lastTs) {
        this.emitEvent(order);
        if (ts > maxLastTs) {
          maxLastTs = ts;
        }
      }
    }

    this._setLastTs(maxLastTs);
  },
};
