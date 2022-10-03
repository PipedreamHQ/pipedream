import slack from "../../slack.app.mjs";

export default {
  key: "slack-invite-user-to-workspace",
  name: "Invite User to Workspace",
  description: "Invite a user to an existing workspace. [See docs here](https://api.slack.com/methods/admin.users.invite)",
  version: "0.0.1",
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
    },
    email: {
      description: "An email address to invite user",
      propDefinition: [
        slack,
        "email",
      ],
    },
    team: {
      propDefinition: [
        slack,
        "team",
      ],
    },
  },
  async run() {
    return await this.slack.sdk().conversations.invite({
      channel_ids: [
        this.conversation,
      ],
      email: this.email,
      team_id: this.team,
    });
  },
};
