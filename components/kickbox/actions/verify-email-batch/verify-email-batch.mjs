import app from "../../kickbox.app.mjs";

export default {
  name: "Verify Email Batch",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "kickbox-verify-email-batch",
  description: "Verify an email batch. [See the documentation](https://docs.kickbox.com/docs/batch-verification-api)",
  type: "action",
  props: {
    app,
    emails: {
      label: "Email",
      description: "Emails to be verified",
      type: "string[]",
    },
  },
  async run({ $ }) {
    const emails = typeof this.emails === "string"
      ? JSON.parse(this.emails)
      : this.emails;

    const response = await this.app.verifyEmailBatch({
      $,
      data: emails,
    });

    if (response) {
      $.export("$summary", `Successfully verified ${emails.length} emails with ID ${response.id}`);
    }

    return response;
  },
};
