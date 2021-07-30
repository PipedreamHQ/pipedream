// Read the Twilio docs at https://www.twilio.com/docs/sms/api/message-resource#create-a-message-resource
const twilio = require("../../twilio.app.js");
const { phone } = require("phone");

module.exports = {
  key: "twilio-send-sms",
  name: "Send SMS",
  description: "Send a simple text-only SMS.",
  type: "action",
  version: "0.0.4",
  props: {
    twilio,
    from: {
      propDefinition: [
        twilio,
        "from",
      ],
    },
    to: {
      propDefinition: [
        twilio,
        "to",
      ],
    },
    body: {
      propDefinition: [
        twilio,
        "body",
      ],
    },
  },
  async run() {
    // Parse the given number into its E.164 equivalent
    // The E.164 phone number will be included in the first element
    // of the array, but the array will be empty if parsing fails.
    // See https://www.npmjs.com/package/phone
    const toParsed = phone(this.to);
    if (!toParsed || !toParsed.phoneNumber) {
      throw new Error(`Phone number ${this.to} couldn't be parsed as a valid number.`);
    }

    const data = {
      to: toParsed.phoneNumber,
      from: this.from,
      body: this.body,
    };

    return await this.twilio.getClient().messages.create(data);
  },
};
