import slicktext from "../../slicktext.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "slicktext-send-message-to-contact",
  name: "Send Message to Contact",
  description: "Deliver a text message to a single contact. [See the documentation](https://api.slicktext.com/docs/v1/messages)",
  version: "0.0.1",
  type: "action",
  props: {
    slicktext,
    contactNumber: {
      propDefinition: [
        slicktext,
        "contactNumber",
      ],
    },
    messageContent: {
      propDefinition: [
        slicktext,
        "messageContent",
      ],
    },
    textwordId: {
      propDefinition: [
        slicktext,
        "textwordId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.slicktext.sendMessage({
      contactNumber: this.contactNumber,
      messageContent: this.messageContent,
      textwordId: this.textwordId,
    });

    const messageId = response.messageId || response.id || "unknown";
    $.export("$summary", `Message sent successfully. Message ID: ${messageId}`);
    return response;
  },
};
