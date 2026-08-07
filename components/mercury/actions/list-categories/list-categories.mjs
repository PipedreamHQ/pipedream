// x-pd-ai: optimized
import mercury from "../../mercury.app.mjs";
import {
  DEFAULT_LIMIT,
  MIN_LIMIT,
  MAX_LIMIT,
  ORDER,
} from "../../common/constants.mjs";

export default {
  key: "mercury-list-categories",
  name: "List Categories",
  description: "List all custom expense categories for the organization. Use this to discover category IDs and names used to classify transactions. Example: call with no parameters -> returns `{ categories: [{ id: \"a1b2...\", name: \"Software\", visibleForCardSpend: true, visibleForOther: true, visibleForReimbursements: false }], page: { nextPage: null, previousPage: null } }`. [See the documentation](https://docs.mercury.com/reference/listcategories)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    mercury,
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of categories to return. Min ${MIN_LIMIT}, max ${MAX_LIMIT}. Defaults to ${DEFAULT_LIMIT} if omitted.`,
      min: MIN_LIMIT,
      max: MAX_LIMIT,
      optional: true,
    },
    order: {
      type: "string",
      label: "Order",
      description: "Sort order. `asc` or `desc`.",
      options: ORDER,
      optional: true,
    },
    startAfter: {
      type: "string",
      label: "Start After",
      description: "Cursor: return categories after this category ID (UUID). Cannot be combined with **End Before**.",
      optional: true,
    },
    endBefore: {
      type: "string",
      label: "End Before",
      description: "Cursor: return categories before this category ID (UUID). Cannot be combined with **Start After**.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mercury.getCategories({
      $,
      params: {
        limit: this.limit ?? DEFAULT_LIMIT,
        order: this.order,
        start_after: this.startAfter,
        end_before: this.endBefore,
      },
    });
    const categories = response?.categories ?? (Array.isArray(response)
      ? response
      : []);
    $.export("$summary", `Successfully retrieved ${categories.length} categor${categories.length === 1
      ? "y"
      : "ies"}`);
    return response;
  },
};
