import hex from "../../hex.app.mjs";

export default {
  key: "hex-get-run-status",
  name: "Get Run Status",
  description: "Get the status of a specific run. [See the documentation](https://learn.hex.tech/docs/api/api-reference#operation/GetRunStatus)",
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
    runId: {
      propDefinition: [
        hex,
        "runId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hex.getRunStatus({
      $,
      projectId: this.projectId,
      runId: this.runId,
    });

    $.export("$summary", `Successfully retrieved status for run ${this.runId}`);
    return response;
  },
};
