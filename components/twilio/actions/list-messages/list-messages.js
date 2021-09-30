const twilio = require("../../twilio.app.js");
const { phone } = require("phone");

module.exports = {
  key: "twilio-list-messages",
  name: "List Messages",
  description: "Return a list of messages associated with your account",
  version: "0.0.1",
  type: "action",
  props: {
    twilio,
    to: {
      propDefinition: [
        twilio,
        "to",
      ],
      description: "Read messages sent to only this phone number. Format the phone number in E.164 format with a + and country code (e.g., +16175551212).",
      optional: true,
    },
    // Not inheriting `propDefinition` from `twilio` because it has value for
    // `options` property
    from: {
      type: "string",
      label: "From",
      description: "Read messages sent from only this phone number or alphanumeric sender ID. Format the phone number in E.164 format with a + and country code (e.g., +16175551212).",
      optional: true,
    },
    limit: {
      propDefinition: [
        twilio,
        "limit",
      ],
    },
  },
  async run() {
    // Parse the given number into its E.164 equivalent
    // The E.164 phone number will be included in the first element
    // of the array, but the array will be empty if parsing fails.
    // See https://www.npmjs.com/package/phone
    let to = this.to;
    if (this.to) {
      const toParsed = phone(this.to);
      if (!toParsed || !toParsed.phoneNumber) {
        throw new Error(`Phone number ${this.to} couldn't be parsed as a valid number.`);
      }
      to = toParsed.phoneNumber;
    }

    return this.twilio.listMessages({
      to: to || undefined, // Use `undefined` if `to` is empty because Twilio API doesn't
      from: this.from || undefined,
      limit: this.limit,
    });
  },
};
