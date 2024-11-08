import helpScout from "../../help_scout.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "help_scout-send-reply",
  name: "Send Reply",
  description: "Sends a reply to a conversation. Be careful as this sends an actual email to the customer. [See the documentation](https://developer.helpscout.com/mailbox-api/endpoints/conversations/threads/reply/)",
  version: "0.0.1",
  type: "action",
  props: {
    helpScout,
    conversationId: {
      propDefinition: [
        helpScout,
        "conversationId",
      ],
    },
    text: {
      propDefinition: [
        helpScout,
        "text",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.helpScout.sendReplyToConversation({
      conversationId: this.conversationId,
      text: this.text,
    });

    $.export("$summary", `Reply sent successfully to conversation ID: ${this.conversationId}`);
    return response;
  },
};
