import common from "../common/common.mjs";

export default {
  ...common,
  key: "thanks_io-new-delivery",
  name: "New Delivery",
  description: "Emit new event for each new order delivered.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  hooks: {
    async deploy() {
      const params = this.subAccount
        ? {
          sub_account_id: this.subAccount,
        }
        : undefined;
      const { data: orders } = await this.thanksIo.listOrders({
        params,
      });
      let count = 0;
      for (const order of orders) {
        if (order.status === "Delivered") {
          this.$emit(order, this.generateMeta(order));
          count ++;
        }
        if (count === 25) {
          break;
        }
      }
    },
  },
  methods: {
    ...common.methods,
    generateMeta(order) {
      return {
        id: order.id,
        summary: `Order delivered: ${order.id}`,
        ts: Date.parse(order?.updated_at?.date),
      };
    },
  },
  async run() {
    const params = this.subaccount
      ? {
        sub_account_id: this.subaccount,
      }
      : undefined;

    const orders = await this.paginate(this.thanksIo.listOrders, params);
    for (const order of orders) {
      if (order.status === "Delivered") {
        this.$emit(order, this.generateMeta(order));
      }
    }
  },
};
