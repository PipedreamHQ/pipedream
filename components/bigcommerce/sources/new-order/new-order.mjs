import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Order",
  version: "0.0.3",
  type: "source",
  key: "bigcommerce-new-order",
  description: "Emit new created order",
  hooks: {
    ...common.hooks,
    async activate() {
      const hookId = await this.bigcommerce.createHook(
        this.http.endpoint,
        "order",
      );
      this.setHookId(hookId);
    },
  },
  methods: {
    ...common.methods,
    getSummary() {
      return "Order created";
    },
  },
};
