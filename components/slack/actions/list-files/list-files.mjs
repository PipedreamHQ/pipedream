import slack from "../../slack.app.mjs";

export default {
  key: "slack-list-files",
  name: "List Files",
  description: "Return a list of files within a team. [See docs here](https://api.slack.com/methods/files.list)",
  version: "0.0.35",
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
    },
    count: {
      propDefinition: [
        slack,
        "count",
      ],
      optional: true,
    },
    team_id: {
      propDefinition: [
        slack,
        "team",
      ],
      optional: true,
    },
    user: {
      propDefinition: [
        slack,
        "user",
      ],
      optional: true,
    },
  },
  async run() {
    return await this.slack.sdk().files.list({
      channel: this.conversation,
      count: this.count,
      user: this.user,
      team_id: this.team_id,
    });
  },
};
