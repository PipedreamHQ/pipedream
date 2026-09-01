// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-query-analytics",
  name: "Query Analytics (OData)",
  description: "Run an OData query against the Azure DevOps Analytics service, which holds the historical and aggregated data the work item APIs do not expose. Returns the matching rows plus the `@odata.context` describing them. Use this for trend questions - how many bugs were open each day, how much work each iteration completed - and use **Query Work Items (WIQL)** instead for the current state of individual items. Set **Apply** to aggregate rather than pulling raw rows back. Example: entity set `WorkItems`, filter `State eq 'Closed'`. [See the documentation](https://learn.microsoft.com/en-us/azure/devops/report/analytics/analytics-query-parts?view=azure-devops)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    azureDevops,
    organization: {
      propDefinition: [
        azureDevops,
        "organizationName",
      ],
    },
    project: {
      propDefinition: [
        azureDevops,
        "project",
      ],
      description: "Project ID or project name to scope the query to. Run the **List Projects** action first to obtain valid values. Omit to query across the whole organization.",
      optional: true,
    },
    entitySet: {
      type: "string",
      label: "Entity Set",
      description: "Analytics entity set to query. Common values: `WorkItems` (current state of each item), `WorkItemSnapshot` (one row per item per day, the basis of burndown and trend charts), `WorkItemRevisions`, `Iterations`, `Areas`, `Teams`, `PipelineRuns`, `TestRuns`.",
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "OData `$filter` expression, e.g. `StateCategory eq 'Completed' and WorkItemType eq 'Bug'`. Escape a literal apostrophe by doubling it.",
      optional: true,
    },
    select: {
      type: "string",
      label: "Select",
      description: "Comma-separated properties to return, e.g. `WorkItemId,Title,State,StoryPoints`. Narrow this - Analytics rows are wide.",
      optional: true,
    },
    orderby: {
      type: "string",
      label: "Order By",
      description: "OData `$orderby` expression, e.g. `ChangedDate desc`",
      optional: true,
    },
    apply: {
      type: "string",
      label: "Apply",
      description: "OData `$apply` aggregation, applied before the other options. Example: `filter(StateCategory eq 'Completed')/groupby((Iteration/IterationName), aggregate(StoryPoints with sum as Points))`. Supported aggregations are `sum`, `average`, `min`, `max`, `countdistinct` and `$count`.",
      optional: true,
    },
    expand: {
      type: "string",
      label: "Expand",
      description: "Related entities to inline, e.g. `Iteration,AssignedTo`",
      optional: true,
    },
    limit: {
      propDefinition: [
        azureDevops,
        "limit",
      ],
      description: "Maximum number of rows to return (1-1000)",
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.queryAnalytics({
      $,
      organization: this.organization,
      project: this.project,
      entitySet: this.entitySet,
      params: {
        $apply: this.apply,
        $filter: this.filter,
        $select: this.select,
        $orderby: this.orderby,
        $expand: this.expand,
        $top: this.limit,
      },
    });
    const rows = response.value ?? [];
    $.export("$summary", `Returned ${rows.length} row${rows.length === 1
      ? ""
      : "s"} from ${this.entitySet}`);
    return response;
  },
};
