import { phone } from "phone";
import twilio from "../../twilio.app.mjs";
import { omitEmptyStringValues } from "../../common/utils.mjs";

export default {
  key: "twilio-list-messages",
  name: "List Messages",
  description: "Return a list of messages associated with your account. [See the documentation](https://www.twilio.com/docs/sms/api/message-resource#read-multiple-message-resources)",
  version: "0.1.4",
  type: "action",
  props: {
    twilio,
    from: {
      propDefinition: [
        twilio,
        "from",
      ],
      description: "Read messages sent from only this phone number or alphanumeric sender ID. Format the phone number in E.164 format with a `+` and country code (e.g., `+16175551212`).",
      optional: true,
    },
    to: {
      propDefinition: [
        twilio,
        "to",
      ],
      description: "Read messages sent to only this phone number. Format the phone number in E.164 format with a `+` and country code (e.g., `+16175551212`).",
      optional: true,
    },
    limit: {
      propDefinition: [
        twilio,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    // Parse the given number into its E.164 equivalent
    // The E.164 phone number will be included in the first element
    // of the array, but the array will be empty if parsing fails.
    // See https://www.npmjs.com/package/phone
    let to = this.to;
    if (this.to) {
      const toParsed = phone(this.to);
      if (!toParsed || !toParsed.phoneNumber) {
        throw new Error(`Phone number ${this.to} could not be parsed as a valid number.`);
      }
      to = toParsed.phoneNumber;
    }

    let from = this.from;
    if (this.from) {
      const fromParsed = phone(this.from);
      if (!fromParsed || !fromParsed.phoneNumber) {
        throw new Error(`Phone number ${this.from} could not be parsed as a valid number.`);
      }
      from = fromParsed.phoneNumber;
    }

    const resp = await this.twilio.listMessages(omitEmptyStringValues({
      to,
      from,
      limit: this.limit,
    }));
    /* eslint-disable multiline-ternary */
    $.export("$summary", `Successfully fetched ${resp.length} message${resp.length === 1 ? "" : "s"}${
      this.from ? ` from ${this.from}` : ""}${this.to ? ` to ${this.to}` : ""}`);
    return resp;
  },
};
