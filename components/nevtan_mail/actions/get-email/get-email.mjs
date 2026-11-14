import app from "../../nevtan_mail.app.mjs";

export default {
  key: "nevtan_mail-get-email",
  name: "Get Email",
  description: "Retrieve a single email from your NevTan Mail mailbox, including its full body.",
  version: "0.0.1",
  type: "action",
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
