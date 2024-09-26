import slack from "../../slack.app.mjs";

export default {
  key: "slack-list-group-members",
  name: "List Group Members",
  description: "List all users in a User Group. [See the documentation](https://api.slack.com/methods/usergroups.users.list)",
  version: "0.0.4",
  type: "action",
  props: {
    slack,
    userGroup: {
      propDefinition: [
        slack,
        "userGroup",
      ],
    },
    team: {
      propDefinition: [
        slack,
        "team",
      ],
      optional: true,
      description: "Encoded team id where the user group exists, required if org token is used.",
    },
  },
  async run({ $ }) {
    const {
      userGroup,
      team,
    } = this;
    const response = await this.slack.sdk().usergroups.users.list({
      usergroup: userGroup,
      team_id: team,
    });
    if (response.users?.length) {
      $.export("$summary", `Successfully retrieved ${response.users.length} user${response.users.length === 1
        ? ""
        : "s"}`);
    }
    return response;
  },
};
