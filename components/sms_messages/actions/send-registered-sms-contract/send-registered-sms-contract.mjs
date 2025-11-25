import smsMessages from "../../sms_messages.app.mjs";

export default {
  key: "sms_messages-send-registered-sms-contract",
  name: "Send Registered SMS Contract",
  description: "Send a registered SMS contract using SMS Messages. [See the documentation](https://api.lleida.net/dtd/sms/v2/en/)",
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
    email: {
      propDefinition: [
        smsMessages,
        "email",
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
          delivery_receipt: {
            cert_type: "T",
            email: this.email,
          },
        },
      },
    });
    $.export("$summary", "Successfully sent registered SMS contract");
    return response;
  },
};
