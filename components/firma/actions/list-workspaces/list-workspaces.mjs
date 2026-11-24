import firma from "../../firma.app.mjs";
import { WORKSPACE_SORT_FIELDS } from "../../common/constants.mjs";

export default {
  key: "firma-list-workspaces",
  name: "List Workspaces",
  description: "Lists Firma workspaces with their `id`, `name`, `protected` flag and dates, optionally filtered by name or creation date. Returns one page: `results` plus `pagination` (`current_page`, `page_size`, `total_count`, `total_pages`); set **Page** to read further pages. **Page Size** is at most 200. A workspace API key sees only its own workspace; an account-admin key sees every workspace of the company. Use it to find the **Workspace ID** for the Firma webhook sources. Each workspace is returned as Firma returns it, including its `api_key` and `test_api_key`. [See the documentation](https://docs.firma.dev/api-reference/workspaces/list-workspaces)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    firma,
    name: {
      propDefinition: [
        firma,
        "nameFilter",
      ],
      description: "Only return workspaces whose name contains this text (case-insensitive), e.g. `Sales`.",
    },
    createdAfter: {
      propDefinition: [
        firma,
        "createdAfter",
      ],
      description: "Only return workspaces created after this ISO 8601 date-time, e.g. `2026-01-31T00:00:00Z`.",
    },
    createdBefore: {
      propDefinition: [
        firma,
        "createdBefore",
      ],
      description: "Only return workspaces created before this ISO 8601 date-time, e.g. `2026-02-28T23:59:59Z`.",
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "The field to sort by, one of `name`, `protected`, `created_on`, e.g. `name`. Defaults to `created_on`.",
      optional: true,
      options: WORKSPACE_SORT_FIELDS,
      default: "created_on",
    },
    sortOrder: {
      propDefinition: [
        firma,
        "sortOrder",
      ],
    },
    page: {
      propDefinition: [
        firma,
        "page",
      ],
    },
    pageSize: {
      propDefinition: [
        firma,
        "pageSize",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.firma.listWorkspaces({
      $,
      params: {
        name: this.name,
        created_after: this.createdAfter,
        created_before: this.createdBefore,
        sort_by: this.sortBy,
        sort_order: this.sortOrder,
        page: this.page,
        page_size: this.pageSize,
      },
    });
    const results = response.results || [];
    const total = response.pagination?.total_count;
    $.export("$summary", `Retrieved ${results.length} workspace(s)${total === undefined
      ? ""
      : ` of ${total}`}`);
    return {
      results,
      pagination: response.pagination,
    };
  },
};
