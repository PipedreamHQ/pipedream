import app from "../../plivo.app.mjs";

export default {
  key: "plivo-new-shipping-label",
  name: "New Shipping Label",
  description: "Emit new event when a new label is shipped. [See the docs](https://shipengine.github.io/shipengine-openapi/#operation/create_webhook).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
