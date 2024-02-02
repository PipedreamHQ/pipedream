import dailybot from "../../dailybot.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dailybot-give-kudos",
  name: "Give Kudos",
  description: "Sends kudos to selected user(s) using DailyBot. [See the documentation](https://www.dailybot.com/docs/api-methods)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dailybot,
    targetUsers: {
      propDefinition: [
        dailybot,
        "targetUsers",
      ],
    },
    messageContent: {
      propDefinition: [
        dailybot,
        "messageContent",
      ],
    },
    isAnonymous: {
      propDefinition: [
        dailybot,
        "isAnonymous",
      ],
    },
    byDailyBot: {
      propDefinition: [
        dailybot,
        "byDailyBot",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dailybot.sendKudos({
      receivers: this.targetUsers,
      content: this.messageContent,
      isAnonymous: this.isAnonymous,
      byDailyBot: this.byDailyBot,
    });

    $.export("$summary", `Successfully sent kudos to ${this.targetUsers.length} user(s)`);
    return response;
  },
};
