import sms from "../../sms.app.mjs";

export default {
  key: "sms-send-sms",
  name: "Send SMS",
  description: "Send an SMS to the [verified phone number for your account](https://pipedream.com/settings). While this feature is in alpha, you may send up to 10 messages per day.",
  version: "0.0.2",
  type: "action",
  props: {
    sms,
    message: {
      type: "string",
      description: "Send an SMS to the [verified phone number for your account](https://pipedream.com/settings). While this feature is in alpha, you may send up to 10 messages per day."
    }
  },
  async run({steps, $}) {
    $.send.sms(this.message)
  },
};