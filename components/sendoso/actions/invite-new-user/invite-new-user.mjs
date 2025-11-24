import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-invite-new-user",
  name: "Invite New User",
  description: "Invite a new user to the account. [See the documentation](https://developer.sendoso.com/rest-api/reference/users/invite-user)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sendoso,
    groupId: {
      propDefinition: [
        sendoso,
        "groupId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the user to invite",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the user to invite",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the user to invite",
    },
    role: {
      type: "string",
      label: "Role",
      description: "The role of the user to invite",
      options: [
        "regular",
        "manager",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sendoso.inviteNewUser({
      $,
      data: {
        user: {
          team_group_id: this.groupId,
          email: this.email,
          first_name: this.firstName,
          last_name: this.lastName,
          role: this.role,
        },
      },
    });
    $.export("$summary", `Successfully invited new user ${this.firstName} ${this.lastName} to group ${this.groupId}`);
    return response;
  },
};
