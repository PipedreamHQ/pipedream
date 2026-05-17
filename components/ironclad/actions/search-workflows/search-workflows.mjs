import app from "../../ironclad.app.mjs";

export default {
  key: "ironclad-search-workflows",
  name: "Search Workflows",
  description: "Query in-flight Ironclad workflows using the native formula filter DSL plus structured params."
    + " **When the ID isn't known**, use this tool to find the workflow first, then call **Get Workflow** for full detail."
    + " **Filter DSL syntax:** Wrap attribute keys in square brackets; wrap string values in single quotes. Valid operators: `Equals`, `NotEqual`, `Contains`, `IsEmpty`, `IsNotEmpty`, `LessThan`, `LessThanOrEqual`, `GreaterThan`, `GreaterThanOrEqual`, `Date`, `Today`, `RelativeDate`, `And`, `Or`."
    + " Examples:"
    + " `Contains([counterpartyName], 'Acme')`,"
    + " `Equals([paperSource], 'Our paper')`,"
    + " `And(Equals([status], 'active'), Contains([counterpartyName], 'Inc'))`,"
    + " `Or(Equals([status], 'paused'), Equals([status], 'active'))`,"
    + " `GreaterThan([lastUpdated], Date('2024-01-01'))`,"
    + " `Equals([startDate], Today())`."
    + " Attribute keys come from **Describe Workflow Template**. Wrap values in single quotes — double quotes fail on some operators."
    + " [See the documentation](https://developer.ironcladapp.com/reference/filter-workflows)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    filter: {
      type: "string",
      label: "Filter",
      description: "Formula filter string (see description for syntax). Example: `Contains([counterpartyName], 'Acme')`.",
      optional: true,
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter by workflow status. Common values: `active`, `paused`, `completed`, `cancelled`, `scheduled`, `expired`.",
      optional: true,
    },
    template: {
      type: "string",
      label: "Template ID",
      description: "Filter to workflows launched from a specific template (24-character hex string, e.g., `5f74b234e4e8e8002c1b2458`). Obtain via **Describe Workspace**.",
      optional: true,
    },
    lastUpdated: {
      type: "string",
      label: "Last Updated After",
      description: "ISO 8601 timestamp. Returns only workflows updated after this time. Example: `2024-01-01T00:00:00Z`.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Zero-indexed page number.",
      optional: true,
      default: 0,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Results per page (max 50).",
      optional: true,
      default: 10,
    },
    hydrateEntities: {
      type: "boolean",
      label: "Hydrate Entities",
      description: "When true, expand referenced entity fields in the response.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.filter) params.filter = this.filter;
    if (this.status?.length) params.status = this.status.join(",");
    if (this.template) params.template = this.template;
    if (this.lastUpdated) params.lastUpdated = this.lastUpdated;
    if (this.page != null) params.page = this.page;
    if (this.pageSize != null) params.pageSize = this.pageSize;
    if (this.hydrateEntities) params.hydrateEntities = true;

    const response = await this.app.listWorkflows({
      $,
      params,
    });

    const list = response?.list ?? [];
    $.export("$summary", `Found ${list.length} workflow(s)${response?.count != null
      ? ` of ${response.count} total`
      : ""}`);

    return response;
  },
};
