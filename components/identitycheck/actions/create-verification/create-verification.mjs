import app from "../../identitycheck.app.mjs";

export default {
  key: "identitycheck-create-verification",
  name: "Create Verification",
  description: "Create a identity check. [See the documentation](https://stackgo.notion.site/How-to-Generate-an-IdentityCheck-API-Key-38a12805b43249a480a96b346c491740)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
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
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createVerification({
      $,
      data: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
      },
    });

    $.export("$summary", `Successfully created an identity check with the following URL: '${response.data.idUrl}'`);

    return response;
  },
};
