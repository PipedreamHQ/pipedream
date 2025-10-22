import { RUN_STATUS_OPTIONS } from "../../common/constants.mjs";
import hex from "../../hex.app.mjs";

export default {
  key: "hex-get-project-runs",
  name: "Get Project Runs",
  description: "Get the status of the API-triggered runs of a project. [See the documentation](https://learn.hex.tech/docs/api/api-reference#operation/GetProjectRuns)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hex,
    projectId: {
      propDefinition: [
        hex,
        "projectId",
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the runs to return.",
      options: RUN_STATUS_OPTIONS,
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of results to return.",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = this.hex.paginateProjectRuns({
      $,
      fn: this.hex.getProjectRuns,
      projectId: this.projectId,
      params: {
        status: this.status,
      },
      maxResults: this.maxResults,
    });

    const runs = [];
    for await (const run of response) {
      runs.push(run);
    }

    $.export("$summary", `Successfully retrieved ${runs.length} run${runs.length === 1
      ? ""
      : "s"} for project ID: ${this.projectId}`);

    return runs;
  },
};
