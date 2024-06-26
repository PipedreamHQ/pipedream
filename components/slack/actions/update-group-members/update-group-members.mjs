import slack from "../../slack.app.mjs";

export default {
  key: "slack-update-group-members",
  name: "Update Groups Members",
  description: "Update the list of users for a User Group. [See the documentation](https://api.slack.com/methods/usergroups.users.update)",
  version: "0.0.3",
  type: "action",
  props: {
    slack,
    userGroup: {
      propDefinition: [
        slack,
        "userGroup",
      ],
    },
    usersToAdd: {
      propDefinition: [
        slack,
        "user",
      ],
      type: "string[]",
      label: "Users to Add",
      description: "A list of encoded user IDs that represent the users to add to the group.",
      optional: true,
    },
    usersToRemove: {
      propDefinition: [
        slack,
        "user",
      ],
      type: "string[]",
      label: "Users to Remove",
      description: "A list of encoded user IDs that represent the users to remove from the group.",
      optional: true,
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
      usersToAdd,
      usersToRemove,
      team,
    } = this;
    let { users } = await this.slack.sdk().usergroups.users.list({
      usergroup: userGroup,
      team_id: team,
    });
    users = users.filter((user) => !usersToRemove.includes(user));
    users.push(...usersToAdd);
    const response = await this.slack.sdk().usergroups.users.update({
      usergroup: userGroup,
      users,
      team_id: team,
    });
    $.export("$summary", `Successfully updated members of group with ID ${this.userGroup}`);
    return response;
  },
};
