import smsFusion from "../../sms_fusion.app.mjs";

export default {
  key: "sms_fusion-send-sms",
  name: "Send SMS",
  description: "Send an SMS using SMS Fusion. [See the documentation](https://docs.smsfusion.com.au/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    smsFusion,
    message: {
      type: "string",
      label: "Message",
      description: "The contents of the SMS you wish to send",
    },
    phoneNumber: {
      propDefinition: [
        smsFusion,
        "phoneNumber",
      ],
    },
    countryCode: {
      propDefinition: [
        smsFusion,
        "countryCode",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.smsFusion.sendSMS({
      $,
      params: {
        msg: this.message,
        num: this.phoneNumber,
        cc: this.countryCode,
      },
    });
    if (response.success) {
      $.export("$summary", "Successfully sent SMS message");
    }
    return response;
  },
};
