import twilio from "../../twilio.app.mjs";

export default {
  key: "twilio-delete-message",
  name: "Delete Message",
  description: "Delete a message record from your account. [See the docs](https://www.twilio.com/docs/sms/api/message-resource#delete-a-message-resource) for more information",
  version: "0.0.1",
  type: "action",
  props: {
    twilio,
    messageId: {
      propDefinition: [
        twilio,
        "messageId",
      ],
    },
  },
  async run({ $ }) {
    const resp = await this.twilio.deleteMessage(this.messageId);
    $.export("$summary", `Successfully deleted the message, "${this.messageId}"`);
    return resp;
  },
};
