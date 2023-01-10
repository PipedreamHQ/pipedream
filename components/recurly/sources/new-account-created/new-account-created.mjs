import app from "../../recurly.app.mjs";

export default {
  key: "recurly-new-account-created",
  name: "New Account Created",
  description: "Emit new event when a new account is created. [See the docs](https://recurly.com/developers/api/v2021-02-25/index.html#operation/list_accounts).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
