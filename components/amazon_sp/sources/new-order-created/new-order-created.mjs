import common from "../common/base.mjs";

export default {
  ...common,
  key: "amazon_sp-new-order-created",
  name: "New Order Created",
  description: "Emit new event when a new order is created in Amazon Seller Central. [See the documentation](https://developer-docs.amazon.com/sp-api/reference/getorders)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(order) {
      return {
        id: order.AmazonOrderId,
        summary: `New Order: ${order.AmazonOrderId}`,
        ts: Date.parse(order.PurchaseDate),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;

    const orders = await this.amazonSellingPartner.getPaginatedResources({
      fn: this.amazonSellingPartner.listOrders,
      params: {
        MarketplaceIds: this.marketplaceId,
        CreatedAfter: lastTs,
      },
      resourceKey: "Orders",
    });

    if (!orders?.length) {
      return;
    }

    for (const order of orders) {
      if (Date.parse(order.PurchaseDate) > Date.parse(maxTs)) {
        maxTs = order.PurchaseDate;
      }
      const meta = this.generateMeta(order);
      this.$emit(order, meta);
    }

    this._setLastTs(maxTs);
  },
};
