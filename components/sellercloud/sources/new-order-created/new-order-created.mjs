import common from "../common/common.mjs";

export default {
  ...common,
  key: "sellercloud-new-order-created",
  name: "New Order Created",
  description: "Emit new event when a new order is created. [See the documentation](https://developer.sellercloud.com/dev-article/get-all-orders/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  hooks: {
    async deploy() {
      const { Items: orders } = await this.sellercloud.listOrders({
        params: {
          pageSize: 25,
        },
      });
      if (!orders.length) {
        return;
      }
      this._setLastCreated(orders[0].CreatedOn);
      orders.forEach((order) => this.emitEvent(order));
    },
  },
  methods: {
    ...common.methods,
    _getLastCreated() {
      return this.db.get("lastCreated");
    },
    _setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    generateMeta(order) {
      return {
        id: order.ID,
        summary: `New Order ID ${order.ID}`,
        ts: Date.parse(order.CreatedOn),
      };
    },
    isLater(date1, date2) {
      return Date.parse(date1) > Date.parse(date2);
    },
    processEvents(orders) {
      const lastCreated = this._getLastCreated();
      let newLastCreated = lastCreated;

      for (const order of orders) {
        this.emitEvent(order);
        if (this.isLater(order.CreatedOn, newLastCreated)) {
          newLastCreated = order.CreatedOn;
        }
      }

      this._setLastCreated(newLastCreated);
    },
  },
  async run() {
    const lastCreated = this._getLastCreated();

    await this.paginateEvents({
      resourceFn: this.sellercloud.listOrders,
      params: {
        CreatedOnFrom: lastCreated,
      },
    });
  },
};
