import app from "../../verifly.app.mjs";

export default {
  key: "verifly-create-bulk-job",
  name: "Create Bulk Job",
  description: "Submit a list of email addresses for asynchronous bulk verification. Returns a job you can poll for status and results. [See the documentation](https://verifly.email/openapi.json).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    emails: {
      propDefinition: [
        app,
        "emails",
      ],
    },
    filename: {
      propDefinition: [
        app,
        "filename",
      ],
    },
    webhookUrl: {
      propDefinition: [
        app,
        "webhookUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createBulkJob({
      $,
      data: {
        emails: this.emails,
        filename: this.filename,
        webhook_url: this.webhookUrl,
      },
    });

    $.export("$summary", `Successfully created bulk verification job${response.job_id
      ? ` \`${response.job_id}\``
      : ""}`);

    return response;
  },
};
