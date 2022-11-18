import slack from "../../slack.app.mjs";

export default {
  key: "slack-user-groups-users-update",
  name: "User Groups Users Update",
  description: "Update the list of users for a User Group. [See docs here](https://api.slack.com/methods/usergroups.users.update)",
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
    users: {
      propDefinition: [
        slack,
        "users",
      ],
    },
    team: {
      propDefinition: [
        slack,
        "team",
      ],
      optional: true,
      description: "Encoded team id where the user group exists, required if org token is used",
    },
  },
  async run() {
    const {
      userGroup,
      users,
      team,
    } = this;
    return await this.slack.sdk().usergroups.users.update({
      usergroup: userGroup,
      users: users,
      team_id: team,
    });
  },
};
