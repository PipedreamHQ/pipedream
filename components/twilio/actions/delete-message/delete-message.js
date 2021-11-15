const twilio = require("../../twilio.app.js");

module.exports = {
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
  async run() {
    return this.twilio.deleteMessage(this.messageId);
  },
};
