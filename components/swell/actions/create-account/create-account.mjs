import app from "../../swell.app.mjs";

export default {
  key: "swell-create-account",
  name: "Create Account",
  description: "Create a new customer account. [See the documentation](https://developers.swell.is/backend-api/accounts/create-an-account)",
  version: "0.0.2",
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
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
    },
    notes: {
      propDefinition: [
        app,
        "notes",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createAccount({
      $,
      data: {
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        phone: this.phone,
        notes: this.notes,
      },
    });
    $.export("$summary", "Successfully created account with ID: " + response.id);
    return response;
  },
};
