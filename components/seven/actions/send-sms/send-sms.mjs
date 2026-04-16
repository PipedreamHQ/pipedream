import seven from "../../seven.app.mjs";

export default {
  key: "seven-send-sms",
  name: "Send SMS",
  description: "Send SMS via Seven. [See the documentation](https://docs.seven.io/en/rest-api/endpoints/sms#send-sms)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    seven,
    to: {
      propDefinition: [
        seven,
        "to",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "SMS message to send",
    },
  },
  async run({ $ }) {
    const response = await this.seven.sendSms({
      $,
      data: {
        to: this.to,
        text: this.text,
      },
    });
    $.export("$summary", `Successfully sent SMS message to number: ${this.to}`);
    return response;
  },
};
