import trolley from "../../trolley.app.mjs";

export default {
  key: "trolley-list-verifications",
  name: "List Verifications",
  description: "List recipient identity verifications across your merchant account. [See the documentation](https://developers.trolley.com/api/#list-all-verifications)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    trolley,
    verificationType: {
      type: "string",
      label: "Verification Type",
      description: "Type of verification to fetch. If omitted, all verifications regardless of type are returned.",
      optional: true,
      options: [
        "individual",
        "business",
        "phone",
        "watchlist",
      ],
    },
    recipientIds: {
      type: "string[]",
      label: "Recipient IDs",
      description: "List of Recipient IDs to filter by (e.g., `R-xxxx`). Use the **List Recipients** action to find available recipient IDs. If omitted, verifications across all recipients are returned.",
      optional: true,
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter by verification status. Allowed values: `pending`, `submitted`, `retry`, `approved`, `expired`, `rejected`.",
      optional: true,
      options: [
        "pending",
        "submitted",
        "retry",
        "approved",
        "expired",
        "rejected",
      ],
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Fetch records updated *after* this date (based on `updatedAt`). ISO 8601 format (e.g., `2026-01-01T00:00:00Z`).",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "Fetch records updated *before* this date (based on `updatedAt`). ISO 8601 format (e.g., `2026-12-31T23:59:59Z`).",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to retrieve (1-indexed).",
      optional: true,
      default: 1,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of results per page (max `1000`).",
      optional: true,
      default: 10,
    },
  },
  async run({ $ }) {
    const params = {
      verificationType: this.verificationType,
      startDate: this.startDate,
      endDate: this.endDate,
      page: this.page,
      pageSize: this.pageSize,
    };
    if (this.recipientIds?.length) {
      params["recipientId"] = this.recipientIds;
    }
    if (this.status?.length) {
      params["status"] = this.status;
    }
    const response = await this.trolley.listVerifications({
      $,
      params,
    });
    const count = response.verifications?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} verification(s)`);
    return response;
  },
};
