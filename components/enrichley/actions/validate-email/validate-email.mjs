import enrichley from "../../enrichley.app.mjs";

export default {
  key: "enrichley-validate-email",
  name: "Validate Email",
  description: "Checks the validity of a single email address using Enrichley. [See the documentation](https://enrichley.readme.io/reference/validatesingleemail)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    enrichley,
    email: {
      type: "string",
      label: "Email",
      description: "The email address to validate",
    },
  },
  async run({ $ }) {
    const response = await this.enrichley.validateEmail({
      $,
      data: {
        email: this.email,
      },
    });
    $.export("$summary", `Successfully retrieved status for email: ${this.email}`);
    return response;
  },
};
