import smsMessages from "../../sms_messages.app.mjs";

export default {
  key: "sms_messages-send-sms",
  name: "Send SMS",
  description: "Send an SMS message using SMS Messages. [See the documentation](https://api.lleida.net/dtd/sms/v2/en/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    smsMessages,
    message: {
      propDefinition: [
        smsMessages,
        "message",
      ],
    },
    numbers: {
      propDefinition: [
        smsMessages,
        "numbers",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.smsMessages.sendSMS({
      $,
      data: {
        sms: {
          user: this.smsMessages.getUser(),
          dst: {
            num: this.numbers,
          },
          txt: this.message,
        },
      },
    });
    $.export("$summary", "Successfully sent SMS message");
    return response;
  },
};
