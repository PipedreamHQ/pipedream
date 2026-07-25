import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-invite-user-to-channel",
  name: "Invite User to Channel",
  description: "Invite a user to an existing channel. Accepts a channel ID or NAME, and a user ID, EMAIL address or display name — all resolved automatically. [See the documentation](https://api.slack.com/methods/conversations.invite)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
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
    // Agents pass whatever identifier the user said — an email in "invite
    // dylan@pipedream.com", a "#channel-name" lifted from the prompt. The raw API answers
    // user_not_found / channel_not_found, which reads as a broken tool rather than a
    // wrong-shaped argument. Every AI-optimized tool in this app resolves names already.
    const channel = await this.slack.resolveChannelId(this.conversation);
    const user = await this.slack.resolveUserId(this.user);
    try {
      const response = await this.slack.inviteToConversation({
        channel,
        users: user,
      });
      $.export("$summary", `Successfully invited user ${this.user} to channel with ID ${channel}`);
      return response;
    } catch (error) {
      if (`${error}`.includes("already_in_channel")) {
        $.export("$summary", `The user ${this.user} is already in the channel`);
        return;
      }
      throw error;
    }
  },
};
