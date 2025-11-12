import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Customer",
  version: "0.0.3",
  type: "source",
  key: "bigcommerce-new-customer",
  description: "Emit new created customer",
  hooks: {
    ...common.hooks,
    async activate() {
      const hookId = await this.bigcommerce.createHook(
        this.http.endpoint,
        "customer",
      );
      this.setHookId(hookId);
    },
  },
  methods: {
    ...common.methods,
    getSummary() {
      return "Customer created";
    },
  },
};
