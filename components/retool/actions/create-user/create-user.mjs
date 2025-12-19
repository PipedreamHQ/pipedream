import app from "../../retool.app.mjs";

export default {
  key: "retool-create-user",
  name: "Create User",
  description: "Creates a new user. [See the documentation](https://docs.retool.com/reference/api/v2#tag/Users/paths/~1users/post).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
    idempotentHint: false,
  },
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The email of the user to be created.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the user.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the user.",
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Whether the user should be active. Defaults to `true` if not provided.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Additional metadata to associate with the user.",
      optional: true,
    },
    userType: {
      type: "string",
      label: "User Type",
      description: "The type of the user.",
      optional: true,
      options: [
        "default",
        "mobile",
        "embed",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      firstName,
      lastName,
      userType,
      ...data
    } = this;

    const response = await app.createUser({
      $,
      data: {
        ...data,
        first_name: firstName,
        last_name: lastName,
        user_type: userType,
      },
    });

    $.export("$summary", `Successfully created user with ID \`${response.data.id}\`.`);
    return response;
  },
};
