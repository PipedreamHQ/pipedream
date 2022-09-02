import slack from "../../slack.app.mjs";

export default {
  key: "slack-list-users",
  name: "List Users",
  description: "Return a list of all users in a workspace. [See docs here](https://api.slack.com/methods/users.list)",
  version: "0.0.5",
  type: "action",
  props: {
    slack,
    team_id: {
      propDefinition: [
        slack,
        "team",
      ],
      optional: true,
    },
  },
  async run() {
    return await this.slack.sdk().users.list();
  },
};
