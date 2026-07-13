import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-post-email-validation-single",
  name: "Validate a Single Email",
  description: "Validates a single email address and returns result. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "Email address to validate",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the email address",
      optional: true,
    },
    ip: {
      type: "string",
      label: "Ip",
      description: "IP address of the email address",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v1.0/email-validation/single",
      data: {
        email: this.email,
        name: this.name,
        ip: this.ip,
      },
    });
    $.export("$summary", "Successfully executed Validate a Single Email");
    return response;
  },
};
