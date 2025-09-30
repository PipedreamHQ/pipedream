import app from "../../uscreen.app.mjs";

export default {
  name: "Create User",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "uscreen-create-user",
  description: "Creates an user. [See the documentation](https://uscreen.io/api/publisher.html#/default/post_customers)",
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The email of the user",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the user",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password of the user",
      secret: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createUser({
      $,
      data: {
        email: this.email,
        name: this.name,
        password: this.password,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created user with ID \`${response.id}\``);
    }

    return response;
  },
};
