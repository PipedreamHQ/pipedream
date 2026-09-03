import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-update-group-members",
  name: "Update Group Members",
  description: "Update the list of users for a User Group. [See the documentation](https://api.slack.com/methods/usergroups.users.update)",
  version: "0.0.19",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
      description: "One or more user IDs to add to the group (e.g. `U1234567890`). Use **Find User by Email** or **List Users** to find valid IDs.",
      optional: true,
    },
    usersToRemove: {
      propDefinition: [
        slack,
        "user",
      ],
      type: "string[]",
      label: "Users to Remove",
      description: "One or more user IDs to remove from the group (e.g. `U1234567890`). Use **Find User by Email** or **List Users** to find valid IDs.",
      optional: true,
    },
    team: {
      propDefinition: [
        slack,
        "team",
      ],
      optional: true,
      description: "The encoded team ID (e.g. `T1234567890`) where the user group exists. Required only if the connected token spans multiple teams (Enterprise Grid). Use **List Teams** to find valid IDs.",
    },
  },
  async run({ $ }) {
    const {
      userGroup,
      usersToAdd = [],
      usersToRemove = [],
      team,
    } = this;
    let { users } = await this.slack.listGroupMembers({
      usergroup: userGroup,
      team_id: team,
    });
    users = users.filter((user) => !usersToRemove.includes(user));
    users.push(...usersToAdd);
    const response = await this.slack.updateGroupMembers({
      usergroup: userGroup,
      users,
      team_id: team,
    });
    $.export("$summary", `Successfully updated members of group with ID ${this.userGroup}`);
    return response;
  },
};
