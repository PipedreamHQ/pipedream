// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-iteration-work-items",
  name: "List Iteration Work Items",
  description: "List the work items assigned to a team's iteration. Returns work item relations carrying each item's id and url rather than its fields, so pass those ids to the **List Work Items** action to read titles, states and assignees. Use this to take the sprint backlog as it currently stands. Run the **List Teams** action first for the team, then the **List Team Iterations** action for the iteration id. Example: returns 14 work item references. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/work/iterations/get-iteration-work-items?view=azure-devops-rest-7.1)",
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
    },
    teamId: {
      propDefinition: [
        azureDevops,
        "teamId",
      ],
    },
    iterationId: {
      propDefinition: [
        azureDevops,
        "iterationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.listIterationWorkItems({
      $,
      organization: this.organization,
      project: this.project,
      teamId: this.teamId,
      iterationId: this.iterationId,
    });
    const relations = response.workItemRelations ?? [];
    $.export("$summary", `Found ${relations.length} work item${relations.length === 1
      ? ""
      : "s"} in the iteration`);
    return response;
  },
};
