import lastpass from "../../lastpass.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "lastpass-delete-user",
  name: "Delete User",
  description: "Deactivates or completely removes a user account. This action must be used responsibly, considering its irreversible nature.",
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
    deleteAction: {
      type: "string",
      label: "Delete Action",
      description: "The type of action to perform",
      options: constants.DELETE_ACTIONS,
    },
  },
  async run({ $ }) {
    const response = await this.lastpass.deactivateOrDeleteUser({
      $,
      data: {
        data: {
          username: this.username,
          deleteaction: this.deleteAction,
        },
      },
    });
    $.export("$summary", `Successfully deactivated or deleted user "${this.username}"`);
    return response;
  },
};
