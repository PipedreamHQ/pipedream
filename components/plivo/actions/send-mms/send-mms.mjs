import app from "../../plivo.app.mjs";

export default {
  key: "plivo-send-mms",
  name: "Send MMS",
  description: "Sends an MMS message to a phone number. [See the docs](https://www.plivo.com/docs/sms/api/message#send-a-message).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
