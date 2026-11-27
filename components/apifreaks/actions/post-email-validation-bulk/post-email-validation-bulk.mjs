import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-post-email-validation-bulk",
  name: "Validate Multiple Email Addresses",
  description: "Validates a bulk of email addresses and returns result for each. Maximum `100` email addresses per request. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    emailData: {
      type: "string",
      label: "Emaildata",
      description: "Array of email objects for bulk validation",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v1.0/email-validation/bulk",
      data: {
        emailData: this.emailData,
      },
    });
    $.export("$summary", "Successfully executed Validate Multiple Email Addresses");
    return response;
  },
};
