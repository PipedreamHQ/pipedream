import slack from "../../slack.app.mjs";

export default {
  key: "slack-invite-user-to-channel",
  name: "Invite User to Channel",
  description: "Invite a user to an existing channel",
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
    return await this.slack.sdk().conversations.invite({
      channel: this.conversation,
      users: this.user,
    });
  },
};
