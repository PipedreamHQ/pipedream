import nile from "../../nile_database.app.mjs";

export default {
  key: "nile_database-create-user",
  name: "Create User",
  description: "Create a new database user by providing an email address and password. [See the documentation](https://www.thenile.dev/docs/reference/api-reference/users/create-user)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nile,
    workspace: {
      propDefinition: [
        nile,
        "workspace",
      ],
    },
    database: {
      propDefinition: [
        nile,
        "database",
        (c) => ({
          workspace: c.workspace,
        }),
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the user",
    },
    password: {
      type: "string",
      label: "Password",
      description: "Password for the user",
    },
    preferredName: {
      type: "string",
      label: "Preferred Name",
      description: "The preferred name of the user",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.nile.createUser({
      $,
      workspace: this.workspace,
      database: this.database,
      data: {
        email: this.email,
        password: this.password,
        preferredName: this.preferredName,
      },
    });
    $.export("$summary", `Successfully created user with ID: ${response.id}`);
    return response;
  },
};
