import herobotChatbotMarketing from "../../herobot_chatbot_marketing.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "herobot_chatbot_marketing-send-message",
  name: "Send Message",
  description: "Sends a message to a user through the chatbot. [See the documentation](https://my.herobot.app/api/swagger/)",
  version: "0.0.1",
  type: "action",
  props: {
    herobotChatbotMarketing,
    userId: herobotChatbotMarketing.propDefinitions.userId,
    contentMessage: herobotChatbotMarketing.propDefinitions.contentMessage,
  },
  async run({ $ }) {
    const response = await this.herobotChatbotMarketing.sendMessage({
      userId: this.userId,
      contentMessage: this.contentMessage,
    });
    $.export("$summary", `Successfully sent message to user ID ${this.userId}`);
    return response;
  },
};
