import common from "../common/common.mjs";

export default {
  ...common,
  key: "thanks_io-new-order",
  name: "New Order",
  description: "Emit new event for each new order placed.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(order) {
      return {
        id: order.id,
        summary: `New Order ID: ${order.id}`,
        ts: Date.parse(order?.created_at?.date),
      };
    },
  },
  async run() {
    const lastCreated = this._getLastTimestamp();
    let newLastCreated = lastCreated;

    const params = lastCreated
      ? {}
      : {
        items_per_page: 25,
      };
    if (this.subaccount) {
      params.sub_account_id = this.subaccount;
    }

    const { data: orders } = await this.thanksIo.listOrders({
      params,
    });
    for (const order of orders) {
      const createdAt = Date.parse(order.created_at.date);
      if (this.isLater(createdAt, lastCreated)) {
        this.$emit(order, this.generateMeta(order));
      }
      if (this.isLater(createdAt, newLastCreated)) {
        newLastCreated = createdAt;
      }
    }

    this._setLastTimestamp(newLastCreated);
  },
};
