import slack from "../../slack.app.mjs";

export default {
  key: "slack-list-users",
  name: "List Users",
  description: "Return a list of all users in a workspace",
  version: "0.0.2",
  type: "action",
  props: {
    slack,
    team_id: {
      propDefinition: [
        slack,
        "team_id",
      ],
      optional: true,
    },
  },
  async run() {
    return await this.slack.sdk().users.list();
  },
};
