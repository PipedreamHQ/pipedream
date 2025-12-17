import app from "../../onedesk.app.mjs";

export default {
  key: "onedesk-create-user",
  name: "Create User",
  description: "Creates a user or a customer. [See the documentation](https://www.onedesk.com/dev/).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The new user email",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the new user",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the new user",
      optional: true,
    },
    type: {
      propDefinition: [
        app,
        "userType",
      ],
    },
    teams: {
      type: "string[]",
      label: "Team IDs",
      propDefinition: [
        app,
        "teamId",
      ],
    },
    isAdmin: {
      type: "boolean",
      label: "Is Administrator",
      description: "Set to `true` if the new user should be an administrator",
      optional: true,
    },
  },
  methods: {
    createUser(args = {}) {
      return this.app.post({
        path: "/users/",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createUser,
      email,
      firstName,
      lastName,
      type,
      teams,
      isAdmin,
    } = this;

    const response = await createUser({
      $,
      data: {
        email,
        firstName,
        lastName,
        type,
        teams,
        isAdmin,
      },
    });

    $.export("$summary", `Successfully created user with ID \`${response.data}\`.`);

    return response;
  },
};
