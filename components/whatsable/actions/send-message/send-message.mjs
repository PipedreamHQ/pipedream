import whatsable from "../../whatsable.app.mjs";

export default {
  key: "whatsable-send-message",
  name: "Send Message",
  description: "Sends a message to a verified WhatsApp number. [See the documentation](https://www.whatsable.app/api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    whatsable,
    phoneNumber: {
      propDefinition: [
        whatsable,
        "phoneNumber",
      ],
    },
    message: {
      propDefinition: [
        whatsable,
        "message",
      ],
    },
  },
  methods: {
    _sanitizePhoneNumber(phoneNumber) {
      return `+${phoneNumber.replace(/[^\w\s]/gi, "")}`;
    },
  },
  async run({ $ }) {
    const sanitizedNumber = this._sanitizePhoneNumber(this.phoneNumber);

    const response = await this.whatsable.sendMessage({
      $,
      data: {
        to: sanitizedNumber,
        text: this.message,
      },
    });

    $.export("$summary", `Successfully sent message to ${this.phoneNumber}`);

    return response;
  },
};
