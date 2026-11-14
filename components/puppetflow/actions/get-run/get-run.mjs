import puppetflow from "../../puppetflow.app.mjs";

export default {
  key: "puppetflow-get-run",
  name: "Get Run",
  description: "Retrieve the full details of a Puppetflow run: `status`, `output`, `error_message`, `duration_ms`,"
    + " whether it is `waiting_for_human_validation` (with its `human_validation_wait_id`) and the `artifacts` links (downloads, screenshots, recording)."
    + " Use it to check the progress of a run started with **Trigger Flow**; use **Get Run Result** when only the output is needed."
    + " [See the documentation](https://docs.puppetflow.com/reference/api/runs#get-a-run)",
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
    includeLogs: {
      propDefinition: [
        puppetflow,
        "includeLogs",
      ],
    },
    includeCode: {
      propDefinition: [
        puppetflow,
        "includeCode",
      ],
    },
  },
  async run({ $ }) {
    const run = await this.puppetflow.getRun({
      $,
      flowId: this.flowId,
      runId: this.runId,
      params: {
        logs: this.includeLogs
          ? 1
          : undefined,
        code: this.includeCode
          ? 1
          : undefined,
      },
    });

    $.export("$summary", `Retrieved run #${run.id} (status: ${run.status})`);
    return run;
  },
};
