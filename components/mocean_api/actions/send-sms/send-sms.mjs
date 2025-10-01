import mocean from "../../mocean_api.app.mjs";

export default {
  key: "mocean_api-send-sms",
  name: "Send SMS",
  description: "Send an outbound SMS from your Mocean account. [See the documentation](https://moceanapi.com/docs/#send-sms)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mocean,
    from: {
      type: "string",
      label: "From",
      description: "The information that is displayed to the recipient as the sender of the SMS when a message is received at a mobile device.",
    },
    to: {
      type: "string",
      label: "To",
      description: "Phone number of the receiver. To send to multiple receivers, separate each entry with white space (‘ ’) or comma (,). Phone number must include country code, for example, a Malaysian phone number will be like 60123456789.",
    },
    text: {
      type: "string",
      label: "Text",
      description: "Contents of the message, URL encoded as necessary (e.g. Text+message+test%21). If you are sending binary content, this will be a hex string.",
    },
  },
  async run({ $ }) {
    const response = await this.mocean.sendSMS({
      data: {
        "mocean-from": this.from,
        "mocean-to": this.to,
        "mocean-text": this.text,
      },
      $,
    });

    if (response) {
      $.export("$summary", "Successfully sent SMS message.");
    }

    return response;
  },
};
