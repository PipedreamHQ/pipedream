import emailable from "../../emailable.app.mjs";

export default {
  key: "emailable-verify-batch-of-emails",
  name: "Verify Batch of Emails",
  description: "Verifies a batch of emails, up to 50,000 per batch. [See the documentation](https://emailable.com/docs/api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    emailable,
    emails: {
      propDefinition: [
        emailable,
        "emails",
      ],
    },
    url: {
      propDefinition: [
        emailable,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.emailable.verifyBatchEmails({
      data: {
        emails: this.emails.join(","),
        url: this.url,
      },
    });
    $.export("$summary", "Batch verification started successfully");
    return response;
  },
};
