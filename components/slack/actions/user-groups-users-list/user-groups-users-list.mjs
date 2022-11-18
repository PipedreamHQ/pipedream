import slack from "../../slack.app.mjs";

export default {
  key: "slack-user-groups-users-list",
  name: "User Groups Users List",
  description: "List all users in a User Group. [See docs here](https://api.slack.com/methods/usergroups.users.list)",
  version: "0.0.1",
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
  async run() {
    const {
      userGroup,
      team,
    } = this;
    return await this.slack.sdk().usergroups.users.list({
      usergroup: userGroup,
      team_id: team,
    });
  },
};
