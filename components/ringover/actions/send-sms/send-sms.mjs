import ringover from "../../ringover.app.mjs";

export default {
  key: "ringover-send-sms",
  name: "Send SMS",
  description: "Sends an SMS using Ringover. [See the documentation](https://developer.ringover.com/?_ga=2.63646317.316145444.1695076986-652152469.1694643800#tag/sms/paths/~1push~1sms/post)",
  version: "0.0.1",
  type: "action",
  props: {
    ringover,
    fromNumber: {
      propDefinition: [
        ringover,
        "number",
      ],
      label: "From Number",
    },
    toNumber: {
      propDefinition: [
        ringover,
        "number",
      ],
      label: "To Number",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The text of the SMS to send",
    },
  },
  async run({ $ }) {
    const response = await this.ringover.sendSMS({
      $,
      data: {
        from_number: this.fromNumber,
        to_number: this.toNumber,
        content: this.content,
      },
    });
    $.export("$summary", "Successfully sent SMS");
    return response;
  },
};
