const twilio = require("../../twilio.app.js");

module.exports = {
  key: "twilio-delete-message",
  name: "Delete Message",
  description: "Delete a message record from your account",
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
