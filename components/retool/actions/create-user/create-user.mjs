import app from "../../retool.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "retool-create-user",
  name: "Create User",
  description: "Creates a new user. [See the documentation](https://docs.retool.com/reference/api/v2#tag/Users/paths/~1users/post).",
  version: "0.0.1",
  type: "action",
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
  methods: {
    createUser(args = {}) {
      return this.app.post({
        versionPath: constants.VERSION_PATH.V2,
        path: "/users",
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
      active,
      metadata,
      userType,
    } = this;

    const response = await createUser({
      $,
      data: {
        email,
        first_name: firstName,
        last_name: lastName,
        active,
        metadata,
        user_type: userType,
      },
    });

    $.export("$summary", `Successfully created user with ID \`${response.data.id}\`.`);
    return response;
  },
};
