import looot from "../../looot.app.mjs";

export default {
  key: "looot-get-run",
  name: "Get Run",
  description: "Read one run: its status, result and cost. Use it after **Run Operation** returned a run ID before the result was ready. [See the documentation](https://docs.looot.ai)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    looot,
    runId: {
      propDefinition: [
        looot,
        "runId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.looot.getRun({
      $,
      runId: this.runId,
    });
    $.export("$summary", `Fetched run ${this.runId}${response?.status
      ? ` (${response.status})`
      : ""}`);
    return response;
  },
};
