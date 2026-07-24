// x-pd-ai: optimized
import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";
import expensify from "../../app/expensify.app";
import {
  REPORT_LIST_FTL_TEMPLATE,
  MIN_LIMIT,
  MAX_LIMIT,
} from "../../common/constants";

export default defineAction({
  key: "expensify-list-reports",
  name: "List Reports",
  description: "Search Expensify reports by state and/or date range and return a structured JSON array of report summaries (reportID, reportName, total, status, submitterEmail, etc.), NOT a file. Use this to find reports before acting on them. Under the hood this calls the Report Exporter with an embedded Freemarker JSON template and reads the result in memory (no /tmp file written). You must provide either a reportState or a startDate/endDate range. Note: OPEN reports cannot be returned when an employeeEmail filter is set (API restriction). Use **List Policies** to discover valid policy IDs for the optional policyId filter. Use **Get Report** to retrieve a single report's full expense line items. [See the documentation](https://integrations.expensify.com/Integration-Server/doc/#report-exporter)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    expensify,
    reportState: {
      propDefinition: [
        expensify,
        "reportState",
      ],
      description: "Filter by a single report state. Closed set: OPEN, SUBMITTED, APPROVED, REIMBURSED, ARCHIVED. **Leave empty to return reports of ALL states in one call** — do not call this action once per state. Provide this or a startDate/endDate range.",
      optional: true,
    },
    startDate: {
      propDefinition: [
        expensify,
        "startDate",
      ],
      description: "Only include reports on/after this date, formatted yyyy-mm-dd (e.g. `2026-01-01`). Required if reportState is omitted.",
      optional: true,
    },
    endDate: {
      propDefinition: [
        expensify,
        "endDate",
      ],
      description: "Only include reports on/before this date, formatted yyyy-mm-dd (e.g. `2026-07-24`). Required by the API when the date range exceeds one year.",
      optional: true,
    },
    employeeEmail: {
      propDefinition: [
        expensify,
        "employeeEmail",
      ],
      description: "Restrict results to this employee's reports. OPEN reports are not returned when this filter is set (API restriction).",
      optional: true,
    },
    policyId: {
      type: "string",
      label: "Policy ID",
      description: "Optional policy ID to filter by. Free-form string; run **List Policies** first to obtain valid IDs.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of reports to return. Min ${MIN_LIMIT}, max ${MAX_LIMIT}.`,
      min: MIN_LIMIT,
      max: MAX_LIMIT,
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.reportState && !this.startDate) {
      throw new ConfigurationError("Provide either reportState or startDate (with optional endDate) to filter reports.");
    }

    // The Report Exporter always requires a startDate (or an ID list); a
    // reportState filter alone is rejected with HTTP 410. When the caller only
    // supplies a reportState, default to a wide start date so the query works.
    const startDate = this.startDate ?? "2000-01-01";

    const fileName = await this.expensify.exportData({
      $,
      template: REPORT_LIST_FTL_TEMPLATE,
      inputSettings: {
        filters: {
          startDate,
          endDate: this.endDate,
          policyIDList: this.policyId,
        },
        reportState: this.reportState,
        employeeEmail: this.employeeEmail,
        limit: this.limit,
      },
    });

    const fileBuffer = await this.expensify.downloadFile({
      $,
      fileName,
    });

    let reports = JSON.parse(Buffer.from(fileBuffer).toString("utf8"));

    if (this.limit) {
      reports = reports.slice(0, this.limit);
    }

    $.export("$summary", `Found ${reports.length} report(s)`);
    return reports;
  },
});
