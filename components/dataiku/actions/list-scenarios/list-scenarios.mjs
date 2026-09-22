import dataiku from "../../dataiku.app.mjs";

export default {
  key: "dataiku-list-scenarios",
  name: "List Scenarios",
  description: "List the scenarios of a DSS project, with each scenario's `id`, whether it is currently `running`, and whether it is `active` (i.e. responding to its own triggers). Call this before **Run Scenario** to find a valid scenario ID, or to check whether a scenario is already in flight before starting another run. Requires the `MONITOR_JOBS` privilege on the project. [See the documentation](https://doc.dataiku.com/dss/api/15/rest/#scenarios-scenarios-get)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
  },
  async run({ $ }) {
    const response = await this.dataiku.listScenarios({
      $,
      projectKey: this.projectKey,
    });
    $.export("$summary", `Found ${response?.length} scenario(s) in project ${this.projectKey}`);
    return response;
  },
};
