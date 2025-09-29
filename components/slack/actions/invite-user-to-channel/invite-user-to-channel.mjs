import slack from "../../slack.app.mjs";

export default {
  key: "slack-invite-user-to-channel",
  name: "Invite User to Channel",
  description: "Invite a user to an existing channel. [See the documentation](https://api.slack.com/methods/conversations.invite)",
  version: "0.0.24",
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
    try {
      const response = await this.slack.inviteToConversation({
        channel: this.conversation,
        users: this.user,
      });
      $.export("$summary", `Successfully invited user ${this.user} to channel with ID ${this.conversation}`);
      return response;
    } catch (error) {
      if (error.includes("already_in_channel")) {
        $.export("$summary", `The user ${this.user} is already in the channel`);
        return;
      }
      throw error;
    }
  },
};
