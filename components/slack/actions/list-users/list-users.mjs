import slack from "../../slack.app.mjs";

export default {
  key: "slack-list-users",
  name: "List Users",
  description: "Return a list of all users in a workspace. [See the documentation](https://api.slack.com/methods/users.list)",
  version: "0.0.18",
  type: "action",
  props: {
    slack,
    teamId: {
      propDefinition: [
        slack,
        "team",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.slack.usersList({
      team_id: this.teamId,
    });
    $.export("$summary", `Successfully retrieved ${response.members.length} user${response.members.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
