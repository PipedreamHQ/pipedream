import firma from "../../firma.app.mjs";
import { TEMPLATE_SORT_FIELDS } from "../../common/constants.mjs";

export default {
  key: "firma-list-templates",
  name: "List Templates",
  description: "Lists Firma templates, optionally filtered by name or creation date. Returns one page: `results` plus `pagination` (`current_page`, `page_size`, `total_count`, `total_pages`); set **Page** to read further pages. **Page Size** is at most 200. Use it to find a template ID for **Get Template** or **Create and Send Signing Request**. [See the documentation](https://docs.firma.dev/api-reference/templates/list-templates)",
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
      description: "Only return templates whose name contains this text (case-insensitive), e.g. `NDA`.",
    },
    createdAfter: {
      propDefinition: [
        firma,
        "createdAfter",
      ],
      description: "Only return templates created after this ISO 8601 date-time, e.g. `2026-01-31T00:00:00Z`.",
    },
    createdBefore: {
      propDefinition: [
        firma,
        "createdBefore",
      ],
      description: "Only return templates created before this ISO 8601 date-time, e.g. `2026-02-28T23:59:59Z`.",
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "The field to sort by.",
      optional: true,
      options: TEMPLATE_SORT_FIELDS,
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
    const response = await this.firma.listTemplates({
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
    const count = response.results?.length ?? 0;
    const total = response.pagination?.total_count;
    $.export("$summary", `Retrieved ${count} template(s)${total === undefined
      ? ""
      : ` of ${total}`}`);
    return response;
  },
};
