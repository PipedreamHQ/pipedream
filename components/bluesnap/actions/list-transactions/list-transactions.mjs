import { ConfigurationError } from "@pipedream/platform";
import bluesnap from "../../bluesnap.app.mjs";

const DEFAULT_LIMIT = 25;

export default {
  key: "bluesnap-list-transactions",
  name: "List Transactions",
  description: "List BlueSnap transactions via the Reporting API. Report data is delayed by about one hour, so transactions from the last hour may not appear yet (use **Get Transaction** for a just-created transaction). Returns transaction summaries whose `Invoice ID` field is the transactionId usable in **Get Transaction** and **Refund Transaction**. The output includes `totalRowCount` and, when more rows remain, a `nextPageToken` to pass back into this action for the next page. [See the documentation](https://developers.bluesnap.com/v8976-Reporting/reference/get-report-data)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
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
    nextPageToken: {
      type: "string",
      label: "Next Page Token",
      description: "The `nextPageToken` value returned by a previous run of this action, to fetch the following page. The token already encodes the original query, so Period, From Date, To Date, and Limit are ignored when it is set. Omit it for the first page.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.nextPageToken
      && this.period === "CUSTOM"
      && (!this.fromDate || !this.toDate)) {
      throw new ConfigurationError("From Date and To Date are required when Period is `CUSTOM`.");
    }

    const params = this.nextPageToken
      ? {
        nextPageToken: this.nextPageToken,
      }
      : {
        period: this.period,
        from_date: this.fromDate,
        to_date: this.toDate,
        pageSize: this.limit ?? DEFAULT_LIMIT,
      };

    const {
      data, headers,
    } = await this.bluesnap.listTransactions({
      $,
      params,
      returnFullResponse: true,
    });

    const nextPageToken = headers["next-page-token"] ?? null;
    const totalRowCount = headers["total-row-count"] === undefined
      ? null
      : Number(headers["total-row-count"]);
    const count = Array.isArray(data?.data)
      ? data.data.length
      : 0;

    $.export("$summary", `Retrieved ${count} transaction(s)${nextPageToken
      ? "; more available via Next Page Token"
      : ""}`);
    return {
      ...data,
      nextPageToken,
      totalRowCount,
    };
  },
};
