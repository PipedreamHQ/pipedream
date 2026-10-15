import dataiku from "../../dataiku.app.mjs";

export default {
  key: "dataiku-run-scenario",
  name: "Run Scenario",
  description: "Start a run of a DSS scenario — the usual way to kick off an orchestrated pipeline (a sequence of builds, checks and reporters) as opposed to building a single dataset, which **Build Dataset** does. Use **List Scenarios** to find a valid scenario ID. A successful call only means the run was accepted, and the response carries no run identifier, so poll **List Scenario Runs** to follow the outcome. Requires the `RUN_JOBS` privilege on the project. [See the documentation](https://doc.dataiku.com/dss/api/15/rest/#scenarios-scenario-post)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    dataiku,
    projectKey: {
      propDefinition: [
        dataiku,
        "projectKey",
      ],
    },
    scenarioId: {
      propDefinition: [
        dataiku,
        "scenarioId",
      ],
    },
    triggerParams: {
      type: "object",
      label: "Trigger Parameters",
      description: "Parameters passed to the scenario run, readable inside the scenario as trigger parameters. Example: `{\"triggerParam1\": \"value1\", \"triggerParam2\": 49}`. Omit if the scenario takes no parameters.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dataiku.runScenario({
      $,
      projectKey: this.projectKey,
      scenarioId: this.scenarioId,
      data: this.triggerParams ?? {},
    });
    $.export("$summary", `Started scenario ${this.scenarioId} in project ${this.projectKey}`);
    return response;
  },
};
