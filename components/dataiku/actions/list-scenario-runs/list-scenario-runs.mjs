// x-pd-ai: optimized
import dataiku from "../../dataiku.app.mjs";

export default {
  key: "dataiku-list-scenario-runs",
  name: "List Scenario Runs",
  description: "Retrieve the most recent runs of a DSS scenario, newest first. Use this after **Run Scenario** to follow that run: a run still in progress has no `end` timestamp and no `result`, while a finished run reports `result.outcome` (e.g. `SUCCESS`) alongside `result.type` (e.g. `SCENARIO_DONE`). Stop polling once the run you are tracking has a `result`, whatever its outcome. Requires the `RUN_JOBS` privilege on the project. [See the documentation](https://doc.dataiku.com/dss/api/15/rest/#scenarios-scenario-get-3)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    limit: {
      propDefinition: [
        dataiku,
        "limit",
      ],
      description: "Maximum number of past runs to retrieve, e.g. `20`. Omit to let DSS apply its own default.",
    },
  },
  async run({ $ }) {
    const response = await this.dataiku.listScenarioRuns({
      $,
      projectKey: this.projectKey,
      scenarioId: this.scenarioId,
      params: {
        limit: this.limit,
      },
    });
    $.export("$summary", `Found ${response?.length} run(s) of scenario ${this.scenarioId}`);
    return response;
  },
};
