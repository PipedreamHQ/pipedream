import { phone } from "phone";
import { messageToString } from "../../common/utils.mjs";
import twilio from "../../twilio.app.mjs";

export default {
  key: "twilio-send-message",
  name: "Send Message",
  description: "Send an SMS text with optional media files. [See the documentation](https://www.twilio.com/docs/sms/api/message-resource#create-a-message-resource)",
  type: "action",
  version: "0.0.3",
  props: {
    twilio,
    from: {
      propDefinition: [
        twilio,
        "from",
      ],
      description: "The sender's Twilio phone number (in [E.164](https://en.wikipedia.org/wiki/E.164) format), [alphanumeric sender ID](https://www.twilio.com/docs/sms/quickstart), [Wireless SIM](https://www.twilio.com/docs/iot/wireless/programmable-wireless-send-machine-machine-sms-commands), [short code](https://www.twilio.com/en-us/messaging/channels/sms/short-codes), or [channel address](https://www.twilio.com/docs/messaging/channels) (e.g., `whatsapp:+15554449999`). The value of the `from` parameter must be a sender that is hosted within Twilio and belongs to the Account creating the Message. If you are using `messaging_service_sid`, this parameter can be empty (Twilio assigns a from value `from` the Messaging Service's Sender Pool) or you can provide a specific sender from your Sender Pool",
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
    mediaUrl: {
      propDefinition: [
        twilio,
        "mediaUrl",
      ],
    },
  },
  async run({ $ }) {
    // Parse the given number into its E.164 equivalent
    // The E.164 phone number will be included in the first element
    // of the array, but the array will be empty if parsing fails.
    // See https://www.npmjs.com/package/phone
    const toParsed = phone(this.to);
    if (!toParsed || !toParsed.phoneNumber) {
      throw new Error(`Phone number ${this.to} could not be parsed as a valid number.`);
    }

    const data = {
      to: toParsed.phoneNumber,
      from: this.from,
      body: this.body,
      mediaUrl: this.mediaUrl,
    };

    const resp = await this.twilio.getClient().messages.create(data);
    $.export("$summary", `Successfully sent a new message, "${messageToString(resp)}"`);
    return resp;
  },
};
