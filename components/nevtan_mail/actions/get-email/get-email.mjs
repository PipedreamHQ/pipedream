import app from "../../nevtan_mail.app.mjs";

export default {
  key: "nevtan_mail-get-email",
  name: "Get Email",
  description: "Retrieve a single email from your NevTan Mail mailbox, including its body. Bodies longer than 100,000 characters are truncated. Use **List Emails** or **Find Emails** to get the email ID. [See the documentation](https://mail.nevtan.com/docs/mail-api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    emailId: {
      propDefinition: [
        app,
        "emailId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getEmail({
      $,
      emailId: this.emailId,
    });
    $.export("$summary", `Retrieved email ${this.emailId} successfully`);
    return response;
  },
};
