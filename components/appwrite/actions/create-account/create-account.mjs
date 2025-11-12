import app from "../../appwrite.app.mjs";

export default {
  key: "appwrite-create-account",
  name: "Create Account",
  description: "Register a new account in your project. [See the documentation](https://appwrite.io/docs/references/cloud/client-web/account#create)",
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
      propDefinition: [
        app,
        "email",
      ],
    },
    password: {
      propDefinition: [
        app,
        "password",
      ],
    },
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createAccount({
      $,
      data: {
        email: this.email,
        password: this.password,
        userId: this.userId,
        name: this.name,
      },
    });

    $.export("$summary", `Successfully created account '${response.name}'`);

    return response;
  },
};
