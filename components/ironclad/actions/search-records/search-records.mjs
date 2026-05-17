import app from "../../ironclad.app.mjs";

export default {
  key: "ironclad-search-records",
  name: "Search Records",
  description: "Query Ironclad repository records using the native formula filter DSL plus structured params."
    + " **When the record ID isn't known**, use this tool to find the record first, then call **Get Record** for full detail."
    + " **Filter DSL syntax:** Wrap property keys in square brackets; wrap string values in single quotes. Valid operators: `Equals`, `NotEqual`, `Contains`, `IsEmpty`, `IsNotEmpty`, `LessThan`, `LessThanOrEqual`, `GreaterThan`, `GreaterThanOrEqual`, `Date`, `Today`, `RelativeDate`, `And`, `Or`."
    + " Examples:"
    + " `Contains([name], 'Hammond')`,"
    + " `Equals([type], 'nda')`,"
    + " `And(Contains([name], 'Nedry'), Equals([status], 'active'))`,"
    + " `GreaterThan([agreementDate], Date('2024-01-01'))`,"
    + " `IsNotEmpty([counterparty])`."
    + " Property keys come from **Describe Workspace** (`recordProperties` + `recordTypes`). Wrap values in single quotes — double quotes fail on some operators."
    + " [See the documentation](https://developer.ironcladapp.com/reference/list-records)",
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
      description: "Formula filter string (see description for syntax). Example: `Contains([name], 'Hammond')`.",
      optional: true,
    },
    types: {
      type: "string",
      label: "Types",
      description: "Comma-separated record type keys to filter by. Example: `nda,msa`. Obtain valid keys via **Describe Workspace**.",
      optional: true,
    },
    lastUpdated: {
      type: "string",
      label: "Last Updated After",
      description: "ISO 8601 timestamp. Returns only records updated after this time.",
      optional: true,
    },
    sortField: {
      type: "string",
      label: "Sort Field",
      description: "Field to sort by.",
      options: [
        "agreementDate",
        "name",
        "lastUpdated",
      ],
      optional: true,
    },
    sortDirection: {
      type: "string",
      label: "Sort Direction",
      description: "Sort direction.",
      options: [
        "ASC",
        "DESC",
      ],
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
    if (this.types) params.types = this.types;
    if (this.lastUpdated) params.lastUpdated = this.lastUpdated;
    if (this.sortField) params.sortField = this.sortField;
    if (this.sortDirection) params.sortDirection = this.sortDirection;
    if (this.page != null) params.page = this.page;
    if (this.pageSize != null) params.pageSize = this.pageSize;
    if (this.hydrateEntities) params.hydrateEntities = true;

    const response = await this.app.listRecords({
      $,
      params,
    });

    const list = response?.list ?? [];
    $.export("$summary", `Found ${list.length} record(s)${response?.count != null
      ? ` of ${response.count} total`
      : ""}`);

    return response;
  },
};
