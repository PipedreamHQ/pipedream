import app from "../../emailable.app.mjs";

export default {
  key: "emailable-verify-batch-of-emails",
  name: "Verify Batch of Emails",
  description: "Verifies a batch of emails, up to 50,000 per batch. [See the documentation](https://emailable.com/docs/api/#verify-a-batch-of-emails)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    emails: {
      propDefinition: [
        app,
        "emails",
      ],
    },
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
  },
  methods: {
    verifyBatchEmails(args = {}) {
      return this.app.post({
        path: "/batch",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      verifyBatchEmails,
      emails,
      url,
    } = this;

    const response = await verifyBatchEmails({
      $,
      data: {
        url,
        emails: Array.isArray(emails)
          ? emails.join(",")
          : emails,
      },
    });
    $.export("$summary", response.message);
    return response;
  },
};
