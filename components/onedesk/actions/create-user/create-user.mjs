import onedesk from "../../onedesk.app.mjs";

export default {
  key: "onedesk-create-user",
  name: "Create User",
  description: "Creates a user or a customer. [See the docs](https://www.onedesk.com/developers/#_create_user)",
  version: "0.0.1",
  type: "action",
  props: {
    onedesk,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the new user",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the new user",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The new user email",
    },
    type: {
      propDefinition: [
        onedesk,
        "userType",
      ],
    },
    teamId: {
      propDefinition: [
        onedesk,
        "teamId",
      ],
    },
    isAdministrator: {
      type: "boolean",
      label: "Is Administrator",
      description: "Set to `true` if the new user should be an administrator",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.onedesk.createUser({
      data: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        type: this.type,
        teamId: this.teamId,
        isAdministrator: this.isAdministrator,
      },
      $,
    });

    $.export("$summary", `Successfully created user with ID ${data.id}.`);

    return data;
  },
};
