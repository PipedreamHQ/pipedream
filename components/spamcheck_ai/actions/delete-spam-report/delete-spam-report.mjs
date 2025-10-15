import app from "../../spamcheck_ai.app.mjs";

export default {
  key: "spamcheck_ai-delete-spam-report",
  name: "Delete Report",
  description: "Delete a spam report. [See the documentation](https://app.spamcheck.ai/api_docs/index.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    reportId: {
      propDefinition: [
        app,
        "reportId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteReport({
      $,
      id: this.reportId,
    });
    $.export("$summary", `Successfully deleted the report with ID: '${this.reportId}'`);
    return response;
  },
};
