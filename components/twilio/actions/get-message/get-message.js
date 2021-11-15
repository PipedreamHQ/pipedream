const twilio = require("../../twilio.app.js");

module.exports = {
  key: "twilio-get-message",
  name: "Get Message",
  description: "Return details of a message. [See the docs](https://www.twilio.com/docs/sms/api/message-resource#fetch-a-message-resource) for more information",
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
    return this.twilio.getMessage(this.messageId);
  },
};
