import lastpass from "../../lastpass.app.mjs";

export default {
  key: "lastpass-add-remove-user-in-groups",
  name: "Add or Remove User in Groups",
  description: "Manages user group membership in LastPass. Either adds a user to a group or removes them from a group.",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    lastpass,
    username: {
      propDefinition: [
        lastpass,
        "username",
      ],
    },
    addGroupNames: {
      type: "string[]",
      label: "Groups to Add",
      description: "A list of group names to add the user to",
      optional: true,
    },
    deleteGroupNames: {
      type: "string[]",
      label: "Groups to Remove",
      description: "A list of group names to remove the user from",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.lastpass.manageUserGroup({
      $,
      data: {
        data: [
          {
            username: this.username,
            add: this.addGroupNames || [],
            del: this.deleteGroupNames || [],
          },
        ],
      },
    });
    $.export("$summary", `User "${this.username} group membership updated`);
    return response;
  },
};
