import app from "../../swell.app.mjs";

export default {
  key: "swell-update-account",
  name: "Update Account",
  description: "Update an existing account with the corresponding ID. [See the documentation](https://developers.swell.is/backend-api/accounts/update-an-account)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
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
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.updateAccount({
      $,
      accountId: this.accountId,
      data: {
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        phone: this.phone,
        notes: this.notes,
      },
    });
    $.export("$summary", "Successfully updated account with ID: " + this.accountId);
    return response;
  },
};
