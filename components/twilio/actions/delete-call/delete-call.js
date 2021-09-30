const twilio = require("../../twilio.app.js");

module.exports = {
  key: "twilio-delete-call",
  name: "Delete Call",
  description: "Remove a call record from your account",
  version: "0.0.1",
  type: "action",
  props: {
    twilio,
    sid: {
      propDefinition: [
        twilio,
        "sid",
      ],
    },
  },
  async run() {
    return await this.twilio.deleteCall(this.sid);
  },
};
