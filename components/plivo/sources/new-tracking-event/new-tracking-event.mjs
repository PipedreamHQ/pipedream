import app from "../../plivo.app.mjs";

export default {
  key: "plivo-new-tracking-event",
  name: "New Tracking Event",
  description: "Emit new event when a new event is tracked. [See the docs](https://shipengine.github.io/shipengine-openapi/#operation/create_webhook).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
