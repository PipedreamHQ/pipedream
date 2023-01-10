import app from "../../recurly.app.mjs";

export default {
  key: "recurly-new-transaction-created",
  name: "New Transaction Created",
  description: "Emit new event when a new transaction is created. [See the docs](https://recurly.com/developers/api/v2021-02-25/index.html#operation/list_transactions).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
