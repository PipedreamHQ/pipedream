import slack from "../../slack.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "slack-kick-user",
  name: "Kick User",
  description: "Remove a user from a conversation. [See the documentation](https://api.slack.com/methods/conversations.kick)",
  version: "0.0.24",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
        () => ({
          types: [
            constants.CHANNEL_TYPE.PUBLIC,
            constants.CHANNEL_TYPE.PRIVATE,
            constants.CHANNEL_TYPE.MPIM,
          ],
        }),
      ],
    },
    user: {
      propDefinition: [
        slack,
        "user",
        (c) => ({
          channelId: c.conversation,
        }),
      ],
    },
  },
  async run({ $ }) {
    try {
      const response = await this.slack.kickUserFromConversation({
        channel: this.conversation,
        user: this.user,
      });
      $.export("$summary", `Successfully kicked user ${this.user} from channel with ID ${this.conversation}`);
      return response;
    } catch (error) {
      if (error.includes("not_in_channel")) {
        $.export("$summary", `The user ${this.user} is not in the channel`);
        return;
      }
      throw error;
    }
  },
};
