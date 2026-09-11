import bamboohr from "../../bamboohr.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "bamboohr-update-time-off-request",
  name: "Update Time Off Request",
  description: "Update an existing time off request using merge-patch semantics — only the fields you set are changed (PATCH /time-off/requests/{id}). Fails with 409 if the request is denied, canceled, or already-started/approved. Editing a request while it's still `REQUESTED` replaces it with a new request, restarting its approval workflow; the returned `id` may differ from the one in the path, and the original id then returns 410 on subsequent calls. Use the `id` from this action's response for later steps. Use **List Time Off Requests** to find the request ID; use **Approve Time Off Request** / **Deny Time Off Request** / **Cancel Time Off Request** for status changes instead. [See the documentation](https://documentation.bamboohr.com/reference/update-time-off-request)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    bamboohr,
    requestId: {
      propDefinition: [
        bamboohr,
        "requestId",
      ],
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "Optional new time off type/category ID for the request, e.g. `5`. Run **List Time Off Types** to discover IDs.",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Optional new start date in YYYY-MM-DD format. When changed, `dailyAmounts` must also be supplied.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "Optional new end date (inclusive) in YYYY-MM-DD format. When changed, `dailyAmounts` must also be supplied.",
      optional: true,
    },
    employeeNote: {
      type: "string",
      label: "Employee Note",
      description: "Optional note from the requester (max 1024 characters).",
      optional: true,
    },
    dailyAmounts: {
      type: "string",
      label: "Daily Amounts",
      description: "JSON array of per-day amounts, replacing the existing breakdown entirely. Each item is `{\"date\":\"YYYY-MM-DD\",\"amount\":<number>}`, e.g. `[{\"date\":\"2026-01-01\",\"amount\":8},{\"date\":\"2026-01-02\",\"amount\":4}]`. Required when changing `startDate` or `endDate`.",
      optional: true,
    },
    returnActions: {
      type: "boolean",
      label: "Return Actions",
      description: "When true, the response includes the state transitions available to the caller for this request.",
      optional: true,
    },
  },
  async run({ $ }) {
    let dailyAmounts;
    if (this.dailyAmounts) {
      try {
        dailyAmounts = JSON.parse(this.dailyAmounts);
      } catch {
        throw new ConfigurationError("`dailyAmounts` must be a valid JSON array, e.g. `[{\"date\":\"2026-01-01\",\"amount\":8}]`");
      }
      if (!Array.isArray(dailyAmounts)) {
        throw new ConfigurationError("`dailyAmounts` must be a JSON array of `{\"date\":\"YYYY-MM-DD\",\"amount\":<number>}` objects");
      }
    }
    if ((this.startDate || this.endDate) && !dailyAmounts) {
      throw new ConfigurationError("`dailyAmounts` must be supplied when changing `startDate` or `endDate`");
    }
    let categoryId;
    if (this.categoryId) {
      categoryId = Number(this.categoryId);
      if (!Number.isInteger(categoryId)) {
        throw new ConfigurationError(`Category ID must be an integer, got \`${this.categoryId}\``);
      }
    }
    const response = await this.bamboohr.updateTimeOffRequest({
      $,
      requestId: this.requestId,
      params: {
        returnActions: this.returnActions,
      },
      data: {
        categoryId,
        startDate: this.startDate,
        endDate: this.endDate,
        employeeNote: this.employeeNote,
        dailyAmounts,
      },
    });
    $.export("$summary", `Updated time off request ${this.requestId}`);
    return response;
  },
};
