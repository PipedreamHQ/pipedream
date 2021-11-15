const twilio = require("../../twilio.app.js");

module.exports = {
  key: "twilio-list-message-media",
  name: "List Message Media",
  description: "Return a list of media associated with your message. [See the docs](https://www.twilio.com/docs/sms/api/media-resource#read-multiple-media-resources) for more information",
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
