import app from "../../plivo.app.mjs";

export default {
  key: "plivo-new-sms-received",
  name: "New SMS Received",
  description: "Emit new event when a new SMS is received. [See the docs](https://www.plivo.com/docs/sms/api/message#send-a-message).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
