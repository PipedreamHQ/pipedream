import app from "../../bouncer.app.mjs";

export default {
  name: "Verify Email Batch",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "bouncer-verify-email-batch",
  description: "Verify multiple emails. [See the documentation](https://docs.usebouncer.com/#b9296001-fa52-459d-997b-bc0663f352d9)",
  type: "action",
  props: {
    app,
    emails: {
      label: "Email",
      description: "Emails to be verified. E.g. `[ \"email@company.com\", \"contact@company.com\" ]`",
      type: "string[]",
    },
  },
  async run({ $ }) {
    const emails = typeof this.emails === "string"
      ? JSON.parse(this.emails)
      : this.emails;

    const response = await this.app.verifyEmailBatch({
      $,
      data: emails.map((email) => ({
        email,
      })),
    });

    if (response) {
      $.export("$summary", `Successfully verified ${emails.length} emails`);
    }

    return response;
  },
};
