// x-pd-ai: optimized
import ironclad from "../../ironclad.app.mjs";

export default {
  key: "ironclad-search-workflows",
  name: "Search Workflows",
  description: "Searches Ironclad workflows using structured filters and/or Ironclad's native formula filter language. Use this to find a workflow's ID before **Get Workflow** or **Update Workflow Attributes**. The `filter` formula operates on attribute keys in `[brackets]` — run **Describe Workspace** first to see valid attribute keys. Formula operators: `Equals([attr], 'value')`, `NotEqual([attr], 'value')`, `Contains([attr], 'value')`, `IsEmpty([attr])`, `IsNotEmpty([attr])`, `LessThan([attr], value)` / `LessThanOrEqual([attr], value)`, `GreaterThan([attr], value)` / `GreaterThanOrEqual([attr], value)`, `Date('2026-01-01')`, `Today()`, `RelativeDate(-7, 'days')`, `And(cond1, cond2, ...)`, `Or(cond1, cond2, ...)`. Always use single quotes for string values — double quotes fail silently on some operators. Worked examples: find by counterparty name `Contains([counterpartyName], 'Acme')`; find active workflows updated in the last week `And(Equals([status], 'active'), GreaterThan([lastUpdated], RelativeDate(-7, 'days')))`; find workflows missing a signed copy `IsEmpty([signedCopy])`; find cancelled OR completed workflows `Or(Equals([status], 'cancelled'), Equals([status], 'completed'))`; find workflows launched from a specific template `Equals([template], 'tmpl_abc123')`. Example: set `status` to `\"active\"` and `pageSize` to `5` to retrieve the 5 most recently updated active workflows; returns `{\"list\": [{\"id\": \"wf_xyz789\", \"title\": \"Acme NDA\", \"status\": \"active\"}], \"count\": 1}`. [See the documentation](https://developer.ironcladapp.com/reference/list-workflows)",
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
      description: "Ironclad formula filter expression, e.g. `Contains([counterpartyName], 'Acme')`. See the tool description for the full operator list and worked examples. Optional — omit to list workflows without a formula filter.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Restrict results to workflows with this single status. Valid values: `active`, `paused`, `completed`, `cancelled`, `archived`. To match multiple statuses, use `filter` instead, e.g. `Or(Equals([status], 'active'), Equals([status], 'paused'))`.",
      optional: true,
      options: [
        "active",
        "paused",
        "completed",
        "cancelled",
        "archived",
      ],
    },
    template: {
      propDefinition: [
        ironclad,
        "templateId",
      ],
      label: "Template",
      description: "Restrict results to workflows launched from this template ID. Obtain via **Describe Workspace**.",
      optional: true,
    },
    lastUpdated: {
      type: "string",
      label: "Last Updated Since",
      description: "ISO 8601 date-time — restrict results to workflows updated at or after this timestamp, e.g. `2026-01-01T00:00:00Z`.",
      optional: true,
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
    } = await this.ironclad.listWorkflows({
      $,
      params: {
        filter: this.filter,
        status: this.status,
        template: this.template,
        lastUpdated: this.lastUpdated,
        page: this.page,
        pageSize: this.pageSize,
        hydrateEntities: this.hydrateEntities,
      },
    });
    $.export("$summary", `Found ${list?.length ?? 0} workflow(s)`);
    return {
      list,
      ...rest,
    };
  },
};
