import { ConfigurationError } from "@pipedream/platform";
import puppetflow from "../../puppetflow.app.mjs";

export default {
  key: "puppetflow-continue-run",
  name: "Continue Run",
  description: "Resume a Puppetflow run that is paused on a human validation step (`$waitHumanValidation()`)."
    + " Use **Get Run** to check `waiting_for_human_validation` and read the `human_validation_wait_id`;"
    + " when `Wait ID` is omitted, the current pending validation of the run is used."
    + " Fails when the run is not active or is not waiting for validation."
    + " [See the documentation](https://docs.puppetflow.com/reference/api/runs#continue-a-waiting-run)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
      description: "The numeric ID of the paused run, e.g. `42`."
        + " Use **List Runs** with status `running` to find it (the `id` field). Must belong to the flow given in `flowId`.",
    },
    waitId: {
      type: "string",
      label: "Wait ID",
      description: "The pending validation UUID, e.g. `0d4f6f0e-1d0a-4b9e-8a1e-6b8a1a2b3c4d`."
        + " Returned as `human_validation_wait_id` by **Get Run**. Leave empty to use the run's current pending validation.",
      optional: true,
    },
  },
  async run({ $ }) {
    let waitId = this.waitId;
    if (!waitId) {
      const run = await this.puppetflow.getRun({
        $,
        flowId: this.flowId,
        runId: this.runId,
      });
      waitId = run.human_validation_wait_id;
      if (!waitId) {
        throw new ConfigurationError(`Run #${this.runId} is not waiting for human validation (status: ${run.status}).`);
      }
    }

    const response = await this.puppetflow.continueRun({
      $,
      flowId: this.flowId,
      runId: this.runId,
      data: {
        wait_id: waitId,
      },
    });

    $.export("$summary", `Continued run #${response.run_id} (status: ${response.status})`);
    return response;
  },
};
