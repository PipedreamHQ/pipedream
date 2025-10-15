import twilio from "../../twilio.app.mjs";

export default {
  key: "twilio-delete-message",
  name: "Delete Message",
  description: "Delete a message record from your account. [See the documentation](https://www.twilio.com/docs/sms/api/message-resource#delete-a-message-resource)",
  version: "0.1.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    twilio,
    messageId: {
      propDefinition: [
        twilio,
        "messageId",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const resp = await this.twilio.deleteMessage(this.messageId);
    $.export("$summary", `Successfully deleted the message, "${this.messageId}"`);
    return resp;
  },
};
