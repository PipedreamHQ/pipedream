import { parseObject } from "../../common/utils.mjs";
import fractel from "../../fractel.app.mjs";

export default {
  key: "fractel-send-sms-mms",
  name: "Send SMS or MMS",
  description: "Allows to send an SMS or MMS to a particular phone number. [See the documentation](https://developer.fonestorm.com/reference/sendmessage)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fractel,
    phoneNumber: {
      propDefinition: [
        fractel,
        "phoneNumber",
      ],
      description: "The phone number to send the message to, including country code.",
    },
    to: {
      propDefinition: [
        fractel,
        "to",
      ],
    },
    message: {
      propDefinition: [
        fractel,
        "message",
      ],
      description: "The message content for SMS or MMS.",
      optional: true,
    },
    media: {
      propDefinition: [
        fractel,
        "media",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.message && !this.media) {
      throw new Error("Either message or media must be provided.");
    }
    const response = await this.fractel.sendMessage({
      $,
      data: {
        to: this.to,
        fonenumber: this.phoneNumber,
        message: this.message,
        media: this.media && parseObject(this.media),
      },
    });

    $.export("$summary", `Successfully sent ${this.message
      ? "SMS"
      : "MMS"} with Id: ${response.message.id}`);
    return response;
  },
};
