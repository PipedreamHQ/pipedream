import gtmetrix from "../../gtmetrix.app.mjs";

export default {
  key: "gtmetrix-get-performance-report",
  name: "Get Performance Report",
  description: "Fetches the most recent performance report for a particular page from GTmetrix. [See the documentation](https://gtmetrix.com/api/docs/2.0/#api-page-latest-report)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gtmetrix,
    pageId: {
      propDefinition: [
        gtmetrix,
        "pageId",
      ],
    },
  },
  async run({ $ }) {
    const { data: report } = await this.gtmetrix.getLatestReport({
      pageId: this.pageId,
      $,
    });

    if (report?.id) {
      $.export("$summary", `Successfully retrieved report with ID ${report.id}.`);
    }

    return report;
  },
};
