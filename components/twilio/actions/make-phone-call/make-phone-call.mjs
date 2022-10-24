import { phone } from "phone";
import twilio from "../../twilio.app.mjs";
import { callToString } from "../../common/utils.mjs";

export default {
  key: "twilio-make-phone-call",
  name: "Make a Phone Call",
  description: "Make a phone call, passing text that Twilio will speak to the recipient of the call. [See the docs](https://www.twilio.com/docs/voice/api/call-resource#create-a-call-resource) for more information",
  version: "0.0.8",
  type: "action",
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
    text: {
      label: "Text",
      type: "string",
      description: "The text you'd like Twilio to speak to the user when they pick up the phone.",
    },
  },
  async run({ $ }) {
    // Parse the given number into its E.164 equivalent
    // The E.164 phone number will be included in the first element
    // of the array, but the array will be empty if parsing fails.
    // See https://www.npmjs.com/package/phone
    const toParsed = phone(this.to);
    console.log(toParsed);
    if (!toParsed || !toParsed.phoneNumber) {
      throw new Error(`Phone number ${this.to} couldn't be parsed as a valid number.`);
    }

    const data = {
      to: toParsed.phoneNumber,
      from: this.from,
      twiml: `<Response><Say>${this.text}</Say></Response>`,
    };

    const resp = await this.twilio.getClient().calls.create(data);
    $.export("$summary", `Successfully made a new phone call, "${callToString(resp)}"`);
    return resp;
  },
};
