// x-pd-ai: optimized
import ironclad from "../../ironclad.app.mjs";

export default {
  key: "ironclad-search-records",
  name: "Search Records",
  description: "Searches Ironclad repository records using structured filters and/or Ironclad's native formula filter language. Use this to find a record's ID before **Get Record**, **Update Record**, or **Delete Record**. The `filter` formula operates on property keys in `[brackets]` — run **Describe Workspace** first to see valid property keys. Formula operators: `Equals([prop], 'value')`, `NotEqual([prop], 'value')`, `Contains([prop], 'value')`, `IsEmpty([prop])`, `IsNotEmpty([prop])`, `LessThan([prop], value)` / `LessThanOrEqual([prop], value)`, `GreaterThan([prop], value)` / `GreaterThanOrEqual([prop], value)`, `Date('2026-01-01')`, `Today()`, `RelativeDate(-7, 'days')`, `And(cond1, cond2, ...)`, `Or(cond1, cond2, ...)`. Always use single quotes for string values — double quotes fail silently on some operators. Worked examples: find by name `Contains([name], 'Hammond')`; find NDAs updated in the last month `And(Equals([type], 'nda'), GreaterThan([lastUpdated], RelativeDate(-30, 'days')))`; find records missing a contract value `IsEmpty([contractValue])`; find vendor agreements OR NDAs `Or(Equals([type], 'vendor_agreement'), Equals([type], 'nda'))`. Example: set `filter` to `Contains([name], 'Hammond')` to find a record by name; returns `{\"list\": [{\"id\": \"rec_abc123\", \"name\": \"Hammond Foundation NDA\", \"type\": \"nda\"}], \"count\": 1}`. [See the documentation](https://developer.ironcladapp.com/reference/list-records)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ironclad,
    filter: {
      type: "string",
      label: "Filter",
      description: "Ironclad formula filter expression, e.g. `Contains([name], 'Hammond')`. See the tool description for the full operator list and worked examples. Optional — omit to list records without a formula filter.",
      optional: true,
    },
    types: {
      type: "string",
      label: "Types",
      description: "Comma-separated record type keys to restrict results to, e.g. `nda,vendor_agreement`. Obtain valid type keys via **Describe Workspace**.",
      optional: true,
    },
    lastUpdated: {
      type: "string",
      label: "Last Updated Since",
      description: "ISO 8601 date-time — restrict results to records updated at or after this timestamp, e.g. `2026-01-01T00:00:00Z`.",
      optional: true,
    },
    sortField: {
      type: "string",
      label: "Sort Field",
      description: "Field to sort results by.",
      optional: true,
      options: [
        "agreementDate",
        "name",
        "lastUpdated",
      ],
    },
    sortDirection: {
      type: "string",
      label: "Sort Direction",
      description: "Sort direction. Defaults to `DESC` if `sortField` is set but this is omitted.",
      optional: true,
      options: [
        "ASC",
        "DESC",
      ],
    },
    page: {
      type: "integer",
      label: "Page",
      description: "0-indexed page of results. Increment and call again if `count` suggests more results than were returned.",
      min: 0,
      default: 0,
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of results per page. Defaults to Ironclad's standard page size if omitted.",
      optional: true,
    },
    hydrateEntities: {
      type: "boolean",
      label: "Hydrate Entities",
      description: "Whether to expand referenced entities in each result. Defaults to `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      list, ...rest
    } = await this.ironclad.listRecords({
      $,
      params: {
        filter: this.filter,
        types: this.types,
        lastUpdated: this.lastUpdated,
        sortField: this.sortField,
        sortDirection: this.sortDirection,
        page: this.page,
        pageSize: this.pageSize,
        hydrateEntities: this.hydrateEntities,
      },
    });
    $.export("$summary", `Found ${list?.length ?? 0} record(s)`);
    return {
      list,
      ...rest,
    };
  },
};
