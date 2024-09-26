import slack from "../../slack.app.mjs";

export default {
  key: "slack-invite-user-to-channel",
  name: "Invite User to Channel",
  description: "Invite a user to an existing channel. [See the documentation](https://api.slack.com/methods/conversations.invite)",
  version: "0.0.19",
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
    const response = await this.slack.sdk().conversations.invite({
      channel: this.conversation,
      users: this.user,
    });
    $.export("$summary", `Successfully invited user ${this.user} to channel with ID ${this.conversation}`);
    return response;
  },
};
