import common from "../common/common.mjs";

export default {
  ...common,
  key: "salesflare-new-account",
  name: "New Account Event",
  description: "Emit new events when new accounts are created. [See the docs](https://api.salesflare.com/docs#operation/getAccounts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getAccounts;
    },
    getSummary(item) {
      return `New account ${item.name} (ID: ${item.id})`;
    },
  },
};
