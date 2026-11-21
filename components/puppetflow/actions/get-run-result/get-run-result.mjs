import puppetflow from "../../puppetflow.app.mjs";

export default {
  key: "puppetflow-get-run-result",
  name: "Get Run Result",
  description: "Retrieve only the `status`, `output`, `error_message` and `duration_ms` of a Puppetflow run."
    + " A lighter alternative to **Get Run** when you just need the data a flow returned."
    + " The `output` is `null` while the run is still `pending` or `running`."
    + " [See the documentation](https://docs.puppetflow.com/reference/api/runs#get-run-result)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    puppetflow,
    flowId: {
      propDefinition: [
        puppetflow,
        "flowId",
      ],
    },
    runId: {
      propDefinition: [
        puppetflow,
        "runId",
        (c) => ({
          flowId: c.flowId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const result = await this.puppetflow.getRunResult({
      $,
      flowId: this.flowId,
      runId: this.runId,
    });

    $.export("$summary", `Retrieved result of run #${result.run_id} (status: ${result.status})`);
    return result;
  },
};
