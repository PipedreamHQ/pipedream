// x-pd-ai: optimized
import { defineAction } from "@pipedream/types";
import expensify from "../../app/expensify.app";
import { REIMBURSED_STATUS } from "../../common/constants";

export default defineAction({
  key: "expensify-update-report-status",
  name: "Update Report Status",
  description: "Update the status of an Expensify report. The Integration Server API currently supports only marking an APPROVED report as REIMBURSED (the `reportStatus` updater). Approve and Reject are NOT supported by the API (attempting `APPROVED` returns responseCode 410), so `status` is a closed set containing only `REIMBURSED`. Use **List Reports** with reportState=APPROVED to find reports eligible for reimbursement. [See the documentation](https://integrations.expensify.com/Integration-Server/doc/#report-status-updater)",
  version: "0.0.1",
  type: "action",
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
      description: "The report ID to update (mapped to reportIDList). Accepts base-10 or base-62 ID (e.g. `R123456789`). Run **List Reports** to find valid IDs.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Target status. Closed set with a single supported value: `REIMBURSED`. Approve/Reject are not offered because the API does not support them.",
      options: [
        REIMBURSED_STATUS,
      ],
    },
    paymentSource: {
      type: "string",
      label: "Payment Source",
      description: "Optional payment source label (1-100 characters) recorded on the reimbursement.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.expensify.updateReportStatus({
      $,
      reportIDList: this.reportId,
      status: this.status,
      paymentSource: this.paymentSource,
    });

    $.export("$summary", `Report ${this.reportId} status updated to ${this.status}`);
    return response;
  },
});
