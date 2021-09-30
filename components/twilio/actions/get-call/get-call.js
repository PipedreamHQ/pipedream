const twilio = require("../../twilio.app.js");

module.exports = {
  key: "twilio-get-call",
  name: "Get Call",
  description: "Return call resource of an individual call",
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
    return await this.twilio.getCall(this.sid);
  },
};
