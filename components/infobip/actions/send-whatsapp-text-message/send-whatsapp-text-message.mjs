import infobip from "../../infobip.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "infobip-send-whatsapp-text-message",
  name: "Send WhatsApp Text Message",
  description: "Sends a WhatsApp text message to a specified number. [See the documentation](https://www.infobip.com/docs/api#channels/whatsapp/send-whatsapp-text-message)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip,
    from: {
      propDefinition: [
        infobip,
        "from",
      ],
    },
    to: {
      propDefinition: [
        infobip,
        "phoneNumber",
      ],
    },
    message: {
      propDefinition: [
        infobip,
        "message",
      ],
    },
    messageId: {
      propDefinition: [
        infobip,
        "messageId",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.infobip.sendWhatsappMessage({
      from: this.from,
      to: this.to,
      message: this.message,
      messageId: this.messageId,
    });
    $.export("$summary", `Successfully sent WhatsApp message to ${this.to}`);
    return response;
  },
};
