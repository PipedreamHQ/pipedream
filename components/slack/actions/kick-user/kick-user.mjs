import slack from "../../slack.app.mjs";

export default {
  key: "slack-kick-user",
  name: "Kick User",
  description: "Remove a user from a conversation",
  version: "0.0.2",
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
      conversation: this.conversation,
      user: this.user,
    });
  },
};
