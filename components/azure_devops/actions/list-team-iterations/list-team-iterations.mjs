// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";
import { ITERATION_TIMEFRAME_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "azure_devops-list-team-iterations",
  name: "List Team Iterations",
  description: "List the iterations a team is subscribed to, each with its name, path and the start date, finish date and timeframe held in its attributes. Set **Timeframe** to `current` to resolve the sprint that is running right now. Use this as the entry point for any sprint question, then pass the iteration id it returns to the work item, capacity and days off actions. Run the **List Teams** action first to obtain the team. Example: returns `Sprint 3` starting `2026-08-17`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/work/iterations/list?view=azure-devops-rest-7.1)",
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
    timeframe: {
      type: "string",
      label: "Timeframe",
      description: "Only return iterations in this timeframe. `current` is the only value the API accepts. Omit to return every iteration the team is subscribed to.",
      options: ITERATION_TIMEFRAME_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const { value: iterations = [] } = await this.azureDevops.listTeamIterations({
      $,
      organization: this.organization,
      project: this.project,
      teamId: this.teamId,
      params: {
        $timeframe: this.timeframe,
      },
    });
    $.export("$summary", `Found ${iterations.length} iteration${iterations.length === 1
      ? ""
      : "s"} for team ${this.teamId}`);
    return iterations;
  },
};
