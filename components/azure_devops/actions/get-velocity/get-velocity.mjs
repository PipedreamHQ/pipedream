// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";
import { COMPLETED_STATE_CATEGORY } from "../../common/constants.mjs";
import { escapeODataString } from "../../common/utils.mjs";

export default {
  key: "azure_devops-get-velocity",
  name: "Get Velocity",
  description: "Report how much work each iteration actually completed, aggregated from the Analytics service. Returns one row per iteration with its name, start and finish dates and the number of completed work items. Covers the whole project by default; set **Team Name** to narrow it to a single team, which is what you want in a project several teams share. Use this to answer whether delivery is speeding up or slowing down, and to sanity-check whether the current sprint is committed beyond its recent average. Set **Points Field** to also sum an estimate, but only if the project's process defines one - the default Basic process has no estimation field and the query fails if you name one it does not have. Example: `Sprint 3` completed 8 items totalling 21 points. [See the documentation](https://learn.microsoft.com/en-us/azure/devops/report/extend-analytics/aggregated-data-analytics?view=azure-devops)",
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
    teamName: {
      type: "string",
      label: "Team Name",
      description: "Only count work owned by this team, e.g. `Fabrikam-Fiber-Git Team`. Analytics matches teams by name, so this must be the display name rather than the team GUID. Run the **List Teams** action first to obtain valid values. Omit to report across every team in the project.",
      optional: true,
    },
    workItemType: {
      propDefinition: [
        azureDevops,
        "workItemType",
      ],
      description: "Only count work items of this type, e.g. `User Story`. Run the **List Work Item Types** action first to obtain valid values. Omit to count every type.",
      optional: true,
    },
    pointsField: {
      type: "string",
      label: "Points Field",
      description: "Analytics property to sum as the iteration's delivered size, e.g. `StoryPoints` (Agile and Scrum processes), `Effort` (Scrum) or `Size` (CMMI). Omit to return completed item counts only, which works on every process. The Basic process defines none of these, so naming one there fails the query.",
      optional: true,
    },
    fromDate: {
      type: "string",
      label: "From Date",
      description: "Only include iterations starting on or after this date, e.g. `2026-01-01Z`. OData date literals are not quoted.",
      optional: true,
    },
    limit: {
      propDefinition: [
        azureDevops,
        "limit",
      ],
      description: "Maximum number of iterations to return (1-1000)",
    },
  },
  async run({ $ }) {
    const filters = [
      `StateCategory eq '${COMPLETED_STATE_CATEGORY}'`,
    ];
    if (this.teamName) {
      filters.push(`Teams/any(t: t/TeamName eq '${escapeODataString(this.teamName)}')`);
    }
    if (this.workItemType) {
      filters.push(`WorkItemType eq '${escapeODataString(this.workItemType)}'`);
    }
    if (this.fromDate) {
      filters.push(`Iteration/StartDate ge ${this.fromDate}`);
    }
    const aggregations = [
      "$count as CompletedWorkItems",
    ];
    if (this.pointsField) {
      aggregations.unshift(`${this.pointsField} with sum as CompletedPoints`);
    }
    const apply = `filter(${filters.join(" and ")})`
      + "/groupby((Iteration/IterationName,Iteration/StartDate,Iteration/EndDate),"
      + `aggregate(${aggregations.join(",")}))`;

    const response = await this.azureDevops.queryAnalytics({
      $,
      organization: this.organization,
      project: this.project,
      entitySet: "WorkItems",
      params: {
        $apply: apply,
        $top: this.limit,
      },
    });
    const iterations = response.value ?? [];
    $.export("$summary", `Computed velocity across ${iterations.length} iteration${iterations.length === 1
      ? ""
      : "s"}${this.teamName
      ? ` for team ${this.teamName}`
      : ""}`);
    return iterations;
  },
};
