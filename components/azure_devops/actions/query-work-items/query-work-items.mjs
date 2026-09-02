// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-query-work-items",
  name: "Query Work Items (WIQL)",
  description: "Run a Work Item Query Language (WIQL) query and return the matching work item references. Returns ids and the queried columns, not full field values - pass the ids to the **List Work Items** action to read those. Use this whenever you need to find work by state, type, assignee or date. Example: `SELECT [System.Id] FROM WorkItems WHERE [System.WorkItemType] = 'Bug' AND [System.State] <> 'Closed'`. WIQL has no offset, so narrow the query itself rather than paging when **Limit** results come back. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/wiql/query-by-wiql?view=azure-devops-rest-7.1)",
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
    query: {
      type: "string",
      label: "Query",
      description: "The WIQL query text. Example: `SELECT [System.Id], [System.Title], [System.State] FROM WorkItems WHERE [System.WorkItemType] = 'Bug' AND [System.State] <> 'Closed' ORDER BY [System.CreatedDate] DESC`",
    },
    limit: {
      propDefinition: [
        azureDevops,
        "limit",
      ],
      description: "Maximum number of work item references to return (1-1000)",
    },
    timePrecision: {
      type: "boolean",
      label: "Time Precision",
      description: "Interpret date values in the query with time precision rather than date-only precision.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.queryWorkItems({
      $,
      organization: this.organization,
      project: this.project,
      params: {
        $top: this.limit,
        timePrecision: this.timePrecision,
      },
      data: {
        query: this.query,
      },
    });
    const count = response.workItems?.length ?? response.workItemRelations?.length ?? 0;
    $.export("$summary", `Query matched ${count} work item${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
