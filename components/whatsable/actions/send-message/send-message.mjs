import whatsable from "../../whatsable.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "whatsable-send-message",
  name: "Send Message",
  description: "Sends a message to a verified WhatsApp number. [See the documentation](https://www.whatsable.app/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    whatsable,
    phoneNumber: {
      propDefinition: [
        whatsable,
        "phoneNumber",
        (c) => ({
          phoneNumber: c.phoneNumber,
        }),
      ],
    },
    message: {
      propDefinition: [
        whatsable,
        "message",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.whatsable.sendMessage({
      phoneNumber: this.phoneNumber,
      message: this.message,
    });
    $.export("$summary", `Sent message to ${this.phoneNumber}`);
    return response;
  },
};
