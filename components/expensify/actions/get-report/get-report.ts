// x-pd-ai: optimized
import { defineAction } from "@pipedream/types";
import expensify from "../../app/expensify.app";
import { REPORT_DETAIL_FTL_TEMPLATE } from "../../common/constants";

export default defineAction({
  key: "expensify-get-report",
  name: "Get Report",
  description: "Retrieve a single Expensify report by ID, returning a structured object with the report metadata plus its complete expense line-item list (per-expense amount, currency, merchant, date, category, receiptURL, etc.). NOT a file. Implemented via the Report Exporter with reportIDList set to the given ID and an embedded Freemarker JSON template read in memory. Use **List Reports** to discover report IDs. This action also covers per-expense reads: the returned transactionList contains full expense details, so a separate expense-by-ID lookup is unnecessary. [See the documentation](https://integrations.expensify.com/Integration-Server/doc/#report-exporter)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    expensify,
    reportId: {
      type: "string",
      label: "Report ID",
      description: "The report ID to fetch. Accepts the base-10 numeric ID or the base-62 ID shown on the Expensify website (e.g. `R123456789`). Run **List Reports** to find valid IDs.",
    },
  },
  async run({ $ }) {
    const fileName = await this.expensify.exportData({
      $,
      template: REPORT_DETAIL_FTL_TEMPLATE,
      inputSettings: {
        filters: {
          reportIDList: this.reportId,
        },
      },
    });

    const fileBuffer = await this.expensify.downloadFile({
      $,
      fileName,
    });

    const reports = JSON.parse(Buffer.from(fileBuffer).toString("utf8"));
    const report = reports[0] ?? null;

    $.export("$summary", report
      ? `Retrieved report ${report.reportID}: ${report.reportName}`
      : `No report found for ID ${this.reportId}`);

    return report;
  },
});
