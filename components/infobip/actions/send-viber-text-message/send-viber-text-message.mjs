import infobip from "../../infobip.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "infobip-send-viber-text-message",
  name: "Send Viber Text Message",
  description: "Send a text message to multiple recipients via Viber. [See the documentation](https://www.infobip.com/docs/api/channels/viber/viber-business-messages/send-viber-messages)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip,
    sender: {
      propDefinition: [
        infobip,
        "sender",
      ],
    },
    to: {
      propDefinition: [
        infobip,
        "to",
      ],
    },
    contentType: {
      propDefinition: [
        infobip,
        "contentType",
      ],
    },
    contentText: {
      propDefinition: [
        infobip,
        "contentText",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.infobip.sendBulkSms({
      sender: this.sender,
      to: this.to,
      contentType: this.contentType,
      contentText: this.contentText,
    });

    $.export("$summary", `Successfully sent a Viber text message to ${this.to.length} recipients`);
    return response;
  },
};
