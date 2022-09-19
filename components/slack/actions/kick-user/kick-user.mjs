import slack from "../../slack.app.mjs";

export default {
  key: "slack-kick-user",
  name: "Kick User",
  description: "Remove a user from a conversation. [See docs here](https://api.slack.com/methods/conversations.kick)",
  version: "0.0.5",
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
  async run() {
    return await this.slack.sdk().conversations.kick({
      channel: this.conversation,
      user: this.user,
    });
  },
};
