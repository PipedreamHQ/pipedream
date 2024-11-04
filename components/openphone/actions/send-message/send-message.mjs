import openphone from "../../openphone.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "openphone-send-message",
  name: "Send a Text Message via OpenPhone",
  description: "Send a text message from your OpenPhone number to a recipient. [See the documentation](https://www.openphone.com/docs/api-reference/messages/send-a-text-message)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    openphone,
    from: {
      propDefinition: [
        openphone,
        "from",
      ],
    },
    to: {
      propDefinition: [
        openphone,
        "to",
      ],
    },
    content: {
      propDefinition: [
        openphone,
        "content",
      ],
    },
    userId: {
      propDefinition: [
        openphone,
        "userId",
      ],
      optional: true,
    },
    setInboxStatus: {
      propDefinition: [
        openphone,
        "setInboxStatus",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.openphone.sendTextMessage({
      from: this.from,
      to: this.to,
      content: this.content,
      userId: this.userId,
      setInboxStatus: this.setInboxStatus,
    });
    $.export("$summary", `Successfully sent message to ${this.to}`);
    return response;
  },
};
