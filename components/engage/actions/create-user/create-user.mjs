import app from "../../engage.app.mjs";

export default {
  key: "engage-create-user",
  name: "Create User",
  description: "Adds a new user to your Engage account. Use this to sync customer data with Engage. [See the documentation](https://docs.engage.so/en-us/a/62bbdd015bfea4dca4834042-users#create-a-user)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    isAccount: {
      propDefinition: [
        app,
        "isAccount",
      ],
    },
    number: {
      propDefinition: [
        app,
        "number",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createUser({
      $,
      data: {
        id: this.userId,
        first_name: this.firstName,
        last_name: this.lastName,
        is_account: this.isAccount,
        number: this.number,
        email: this.email,
      },
    });
    $.export("$summary", `Successfully created user with ID: ${response.id}`);
    return response;
  },
};
