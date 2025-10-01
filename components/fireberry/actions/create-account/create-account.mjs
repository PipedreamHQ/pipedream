import app from "../../fireberry.app.mjs";

export default {
  key: "fireberry-create-account",
  name: "Create Account",
  description: "Creates a new account in Fireberry. [See the documentation](https://developers.fireberry.com/reference/create-an-account)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    accountName: {
      propDefinition: [
        app,
        "accountName",
      ],
    },
    emailAddress1: {
      propDefinition: [
        app,
        "emailAddress1",
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
    websiteUrl: {
      propDefinition: [
        app,
        "websiteUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createAccount({
      $,
      data: {
        accountname: this.accountName,
        emailaddress1: this.emailAddress1,
        firstname: this.firstName,
        lastname: this.lastName,
        websiteurl: this.websiteUrl,
      },
    });

    $.export("$summary", `Created account with name: ${this.accountName}`);
    return response;
  },
};
