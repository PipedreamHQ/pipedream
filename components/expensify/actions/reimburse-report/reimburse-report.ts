import { ConfigurationError } from "@pipedream/platform";
import { defineAction } from "@pipedream/types";
import expensify from "../../app/expensify.app";
import { REIMBURSED_STATUS } from "../../common/constants";

export default defineAction({
  key: "expensify-reimburse-report",
  name: "Reimburse Report",
  description: "Mark an APPROVED Expensify report as `REIMBURSED` via the Integration Server `reportStatus` updater. This is the only report-status transition the API supports — Approve and Reject are not available (attempting `APPROVED` returns responseCode 410). Use **List Reports** with reportState=APPROVED to find reports eligible for reimbursement. [See the documentation](https://integrations.expensify.com/Integration-Server/doc/#report-status-updater)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    expensify,
    reportId: {
      type: "string",
      label: "Report ID",
      description: "The ID of the APPROVED report to mark as reimbursed (mapped to reportIDList). Accepts base-10 or base-62 ID (e.g. `R123456789`). Run **List Reports** to find valid IDs.",
    },
    paymentSource: {
      type: "string",
      label: "Payment Source",
      description: "Optional payment source label (1-100 characters) recorded on the reimbursement.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (
      this.paymentSource != null &&
      (this.paymentSource.length < 1 || this.paymentSource.length > 100)
    ) {
      throw new ConfigurationError("Payment Source must be between 1 and 100 characters.");
    }

    const response = await this.expensify.updateReportStatus({
      $,
      reportIDList: this.reportId,
      status: REIMBURSED_STATUS,
      paymentSource: this.paymentSource,
    });

    $.export("$summary", `Report ${this.reportId} marked as reimbursed`);
    return response;
  },
});
