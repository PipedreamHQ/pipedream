import getprospect from "../../getprospect.app.mjs";

export default {
  key: "getprospect-verify-email",
  name: "Verify Email",
  description: "Verify an email address. [See the documentation](https://getprospect.readme.io/reference/publicapiemailcontroller_sendbounceemail)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    getprospect,
    email: {
      type: "string",
      label: "Email",
      description: "The email address to verify",
    },
  },
  async run({ $ }) {
    const response = await this.getprospect.verifyEmail({
      $,
      params: {
        email: this.email,
      },
    });
    $.export("$summary", `Email status: ${response.status}`);
    return response;
  },
};
