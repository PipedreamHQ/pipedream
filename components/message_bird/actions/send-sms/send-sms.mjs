import messagebird from "../../message_bird.app.mjs";

export default {
  key: "message_bird-send-sms",
  name: "Send SMS",
  description: "Sends an SMS message. [See the documentation](https://developers.messagebird.com/api/sms-messaging/#send-outbound-sms)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    messagebird,
    originator: {
      propDefinition: [
        messagebird,
        "originator",
      ],
    },
    body: {
      propDefinition: [
        messagebird,
        "body",
      ],
    },
    recipients: {
      propDefinition: [
        messagebird,
        "recipients",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.messagebird.sendSMS({
      $,
      data: {
        originator: this.originator,
        body: this.body,
        recipients: typeof this.recipients === "string"
          ? JSON.parse(this.recipients)
          : this.recipients,
        type: "sms",
      },
    });
    $.export("$summary", `Successfully sent SMS with ID ${response.id}`);
    return response;
  },
};
