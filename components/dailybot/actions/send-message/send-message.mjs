import { parseObject } from "../../common/utils.mjs";
import dailybot from "../../dailybot.app.mjs";

export default {
  key: "dailybot-send-message",
  name: "Send Message",
  description: "Dispatches a message to designated users or groups in DailyBot. Required are the message content and recipients' IDs, and channels or rooms are optional targets. [See the documentation](https://www.dailybot.com/docs/api-methods)",
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
      optional: true,
    },
    targetTeams: {
      propDefinition: [
        dailybot,
        "targetTeams",
      ],
      optional: true,
    },
    messageContent: {
      propDefinition: [
        dailybot,
        "messageContent",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dailybot.dispatchMessage({
      $,
      data: {
        target_users: this.targetUsers && parseObject(this.targetUsers),
        target_teams: this.targetTeams && parseObject(this.targetTeams),
        message: this.messageContent,
      },
    });
    $.export("$summary", "Message dispatched successfully");
    return response;
  },
};
