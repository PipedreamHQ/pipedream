import dailybot from "../../dailybot.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dailybot-send-message",
  name: "Send Message",
  description: "Dispatches a message to designated users or groups in DailyBot. Required are the message content and recipients' IDs, and channels or rooms are optional targets. [See the documentation](https://www.dailybot.com/docs/api-methods)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dailybot,
    messageContent: dailybot.propDefinitions.messageContent,
    recipientsIds: dailybot.propDefinitions.recipientsIds,
    channelsOrRooms: dailybot.propDefinitions.channelsOrRooms,
  },
  async run({ $ }) {
    const response = await this.dailybot.dispatchMessage({
      messageContent: this.messageContent,
      recipientsIds: this.recipientsIds,
      channelsOrRooms: this.channelsOrRooms,
    });
    $.export("$summary", "Message dispatched successfully");
    return response;
  },
};
