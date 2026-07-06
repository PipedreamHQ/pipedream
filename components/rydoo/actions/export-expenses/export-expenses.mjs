import rydoo from "../../rydoo.app.mjs";

export default {
  key: "rydoo-export-expenses",
  name: "Export Expenses",
  description: "Retrieves a list of expenses that have been exported, with optional filtering by date range, user, group, trip, or branch. [See the documentation](https://developers.rydoo.com/reference/v2expensesgetexportedexpenses)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rydoo,
    userId: {
      propDefinition: [
        rydoo,
        "userId",
      ],
      optional: true,
    },
    groupId: {
      propDefinition: [
        rydoo,
        "groupId",
      ],
      optional: true,
    },
    tripId: {
      propDefinition: [
        rydoo,
        "tripId",
      ],
      optional: true,
    },
    branchId: {
      propDefinition: [
        rydoo,
        "branchId",
      ],
      optional: true,
    },
    exportedAtStartDate: {
      type: "string",
      label: "Exported At Start Date",
      description: "Return expenses exported on or after this date (ISO 8601, e.g., `2024-01-01T00:00:00Z`)",
      optional: true,
    },
    exportedAtEndDate: {
      type: "string",
      label: "Exported At End Date",
      description: "Return expenses exported on or before this date (ISO 8601, e.g., `2024-12-31T23:59:59Z`)",
      optional: true,
    },
    onlyLatestVersions: {
      type: "boolean",
      label: "Only Latest Versions",
      description: "When set to `true`, returns only the most recent version of each expense",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of expenses to return per page",
      optional: true,
      min: 1,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of expenses to skip for paging (defaults to `0`)",
      optional: true,
      min: 0,
    },
  },
  async run({ $ }) {
    const response = await this.rydoo.getExportedExpenses({
      $,
      params: {
        userId: this.userId,
        groupId: this.groupId,
        tripId: this.tripId,
        branchId: this.branchId,
        exportedAtStartDate: this.exportedAtStartDate,
        exportedAtEndDate: this.exportedAtEndDate,
        onlyLatestVersions: this.onlyLatestVersions,
        limit: this.limit,
        offset: this.offset,
      },
    });

    const expenses = response?.data || response;
    const count = Array.isArray(expenses)
      ? expenses.length
      : 0;
    $.export("$summary", `Successfully exported ${count} expense${count === 1
      ? ""
      : "s"}.`);

    return response;
  },
};
