import { parseObject } from "../../common/utils.mjs";
import dailybot from "../../dailybot.app.mjs";

export default {
  key: "dailybot-give-kudos",
  name: "Give Kudos",
  description: "Sends kudos to selected user(s) using DailyBot. [See the documentation](https://www.dailybot.com/docs/api-methods)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      optional: true,
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
      $,
      data: {
        receivers: parseObject(this.targetUsers),
        content: this.messageContent,
        is_anonymous: this.isAnonymous,
        by_dailybot: this.byDailyBot,
      },
    });

    $.export("$summary", `Successfully sent kudos to ${this.targetUsers.length} user(s)`);
    return response;
  },
};
