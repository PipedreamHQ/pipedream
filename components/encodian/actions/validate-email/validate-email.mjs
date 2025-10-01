import app from "../../encodian.app.mjs";

export default {
  key: "encodian-validate-email",
  name: "Validate Email",
  description: "Validate the syntax of an email address. [See the documentation](https://api.apps-encodian.com/index.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    emailAddress: {
      propDefinition: [
        app,
        "emailAddress",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.validateEmail({
      $,
      data: {
        emailAddress: this.emailAddress,
        regex: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$",
      },
    });

    $.export("$summary", `The validation of the email address returned: '${response.result}'`);

    return response;
  },
};
