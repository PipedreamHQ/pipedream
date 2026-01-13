import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "bitmex-new-order",
  name: "New Order",
  description: "Emit new event when a new order is placed on your BitMEX account. [See the documentation](https://www.bitmex.com/api/explorer/#!/Order/Order_getOrders)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    symbol: {
      propDefinition: [
        common.props.bitmex,
        "symbol",
      ],
    },
  },
  methods: {
    ...common.methods,
    _getEmittedOrderIds() {
      return new Set(this.db.get("emittedOrderIds") || []);
    },
    _setEmittedOrderIds(orderIds) {
      this.db.set("emittedOrderIds", Array.from(orderIds));
    },
  },
  hooks: {
    async deploy() {
      const orders = await this.bitmex.getOrders({
        symbol: this.symbol,
        count: 25,
        reverse: true,
      });

      const emittedOrderIds = new Set();
      for (const order of orders.slice(0, 10)) {
        if (order.orderID) {
          emittedOrderIds.add(order.orderID);
          this.$emit(order, {
            id: order.orderID,
            summary: `New order: ${order.symbol} ${order.side} ${order.orderQty || 0}`,
            ts: order.timestamp
              ? new Date(order.timestamp).getTime()
              : Date.now(),
          });
        }
      }
      this._setEmittedOrderIds(emittedOrderIds);
      if (orders.length > 0 && orders[0].timestamp) {
        this._setLastTimestamp(new Date(orders[0].timestamp).getTime());
      }
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    const emittedOrderIds = this._getEmittedOrderIds();
    const now = Date.now();

    const orders = await this.bitmex.getOrders({
      symbol: this.symbol,
      count: 100,
      reverse: true,
    });

    const newOrders = [];
    for (const order of orders) {
      if (!order.orderID || emittedOrderIds.has(order.orderID)) {
        continue;
      }

      const orderTimestamp = order.timestamp
        ? new Date(order.timestamp).getTime()
        : now;
      if (!lastTimestamp || orderTimestamp > lastTimestamp) {
        newOrders.push(order);
        emittedOrderIds.add(order.orderID);
      }
    }

    // Sort by timestamp ascending
    newOrders.sort((a, b) => {
      const tsA = a.timestamp
        ? new Date(a.timestamp).getTime()
        : 0;
      const tsB = b.timestamp
        ? new Date(b.timestamp).getTime()
        : 0;
      return tsA - tsB;
    });

    for (const order of newOrders) {
      this.$emit(order, {
        id: order.orderID,
        summary: `New order: ${order.symbol} ${order.side} ${order.orderQty || 0}`,
        ts: order.timestamp
          ? new Date(order.timestamp).getTime()
          : Date.now(),
      });
    }

    if (newOrders.length > 0) {
      const latestTimestamp = newOrders[newOrders.length - 1].timestamp
        ? new Date(newOrders[newOrders.length - 1].timestamp).getTime()
        : now;
      this._setLastTimestamp(latestTimestamp);
    }

    // Keep only recent order IDs (last 1000)
    const orderIdsArray = Array.from(emittedOrderIds);
    if (orderIdsArray.length > 1000) {
      this._setEmittedOrderIds(new Set(orderIdsArray.slice(-1000)));
    } else {
      this._setEmittedOrderIds(emittedOrderIds);
    }
  },
};

