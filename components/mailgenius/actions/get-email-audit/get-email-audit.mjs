import app from "../../mailgenius.app.mjs";

export default {
  key: "mailgenius-get-email-audit",
  name: "Get Email Audit",
  description: "Returns generated test email, limit exceeded if daily limit is reached. [See the documentation](https://app.mailgenius.com/api-docs/index.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
  },

  async run({ $ }) {
    const response = await this.app.emailAudit({
      $,
    });

    $.export("$summary", `Your test email is: ${response.test_email}. Please send an email to this address using the account you want to test`);

    return response;
  },
};
