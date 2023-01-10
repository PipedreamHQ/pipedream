import app from "../../recurly.app.mjs";

export default {
  key: "recurly-new-subscription-created",
  name: "New Subscription Created",
  description: "Emit new event when a new subscription is created. [See the docs](https://recurly.com/developers/api/v2021-02-25/index.html#operation/list_subscriptions).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
