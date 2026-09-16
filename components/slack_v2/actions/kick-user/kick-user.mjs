import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-kick-user",
  name: "Kick User",
  description: "Remove a user from a conversation. [See the documentation](https://api.slack.com/methods/conversations.kick)",
  version: "0.0.36",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
    },
    user: {
      propDefinition: [
        slack,
        "user",
      ],
    },
  },
  async run({ $ }) {
    // conversations.kick only accepts a channel ID — resolve a name (or user ID, for a
    // DM) the same way every other AI-optimized tool in this app does.
    const channel = await this.slack.resolveChannelId(this.conversation);
    try {
      const response = await this.slack.kickUserFromConversation({
        channel,
        user: this.user,
      });
      $.export("$summary", `Successfully kicked user ${this.user} from channel with ID ${channel}`);
      return response;
    } catch (error) {
      if (`${error}`.includes("not_in_channel")) {
        $.export("$summary", `The user ${this.user} is not in the channel`);
        return;
      }
      throw error;
    }
  },
};
