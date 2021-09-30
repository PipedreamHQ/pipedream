const twilio = require("../../twilio.app.js");

module.exports = {
  key: "twilio-list-message-media",
  name: "List Message Media",
  description: "Return a list of media associated with your message",
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
    limit: {
      propDefinition: [
        twilio,
        "limit",
      ],
    },
  },
  async run() {
    return await this.twilio.listMessageMedia(this.messageId, {
      limit: this.limit,
    });
  },
};
