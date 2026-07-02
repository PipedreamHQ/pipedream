import komos from "../../komos.app.mjs";

export default {
  key: "komos-get-task-run",
  name: "Get Task Run",
  description: "Fetch the latest status and outputs for a Komos task run. [See the documentation](https://docs.komos.ai/api-reference/task-runs/get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    komos,
    runId: {
      propDefinition: [
        komos,
        "runId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.komos.getTaskRun({
      $,
      runId: this.runId,
    });

    const status = response.status ?? response.run?.status ?? "unknown";
    $.export("$summary", `Komos task run status: ${status}`);
    return response;
  },
};
