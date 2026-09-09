// x-pd-ai: optimized
import bluesnap from "../../bluesnap.app.mjs";
import { DEFAULT_LIMIT } from "../../common/constants.mjs";

export default {
  key: "bluesnap-list-transactions",
  name: "List Transactions",
  description: "List BlueSnap transactions via the Reporting API (GET /services/2/report/TransactionDetail). Returns transaction summaries whose `Invoice ID` field is the transactionId usable in **Get Transaction** and **Refund Transaction**. [See the documentation](https://developers.bluesnap.com/v8976-Reporting/reference/get-report-data)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    bluesnap,
    period: {
      propDefinition: [
        bluesnap,
        "period",
      ],
    },
    fromDate: {
      type: "string",
      label: "From Date",
      description: "Start date as `MM/DD/YYYY` (e.g. `01/01/2025`). Required when period is `CUSTOM`.",
      optional: true,
    },
    toDate: {
      type: "string",
      label: "To Date",
      description: "End date as `MM/DD/YYYY` (e.g. `12/31/2025`). Required when period is `CUSTOM`.",
      optional: true,
    },
    limit: {
      propDefinition: [
        bluesnap,
        "limit",
      ],
      description: "Maximum number of transactions to return (page size). Must be between 1 and 1000.",
    },
  },
  async run({ $ }) {
    const response = await this.bluesnap.listTransactions({
      $,
      params: {
        period: this.period,
        fromDate: this.fromDate,
        toDate: this.toDate,
        pageSize: this.limit ?? DEFAULT_LIMIT,
      },
    });

    const transactions = response?.reportData?.data ?? response ?? [];
    const count = Array.isArray(transactions)
      ? transactions.length
      : 0;
    $.export("$summary", `Retrieved ${count} transaction(s)`);
    return response;
  },
};
