import app from "../../mails_so.app.mjs";

export default {
  key: "mails_so-validate-email",
  name: "Validate Email",
  description: "Send an email address to be validated by the API. [See the documentation](https://www.postman.com/joint-operations-engineer-25774813/workspace/mails-so/request/36028084-aa3b6359-bbdd-451b-8596-548a4d913f38)",
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
  },
  async run({ $ }) {
    const response = await this.app.validateEmail({
      $,
      params: {
        email: this.email,
      },
    });
    $.export("$summary", `Email validation result: '${response.data.result}'`);
    return response;
  },
};
