import cody from "../../cody.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "cody-send-message",
  name: "Send Message",
  description: "Send your message and receive the AI-generated response. [See the documentation](https://developers.meetcody.ai/operation/operation-send-message)",
  version: "0.0.1",
  type: "action",
  props: {
    cody,
    contentMessage: {
      propDefinition: [
        cody,
        "contentMessage",
      ],
    },
    conversationId: {
      propDefinition: [
        cody,
        "conversationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.cody.sendMessage({
      contentMessage: this.contentMessage,
      conversationId: this.conversationId,
    });

    $.export("$summary", `Sent message successfully with ID ${response.id}`);
    return response;
  },
};
