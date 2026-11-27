import { ConfigurationError } from "@pipedream/platform";
import puppetflow from "../../puppetflow.app.mjs";
import {
  DEFAULT_POLL_INTERVAL_SECONDS,
  DEFAULT_WAIT_TIMEOUT_SECONDS,
  MAX_WAIT_TIMEOUT_SECONDS,
  TERMINAL_RUN_STATUSES,
} from "../../common/constants.mjs";
import {
  parseObject, sleep,
} from "../../common/utils.mjs";

export default {
  key: "puppetflow-trigger-flow",
  name: "Trigger Flow",
  description: "Start a new run of a Puppetflow flow, optionally passing JSON input that the flow reads from `$input`."
    + " By default the run is dispatched asynchronously and a `run_id` with status `pending` is returned;"
    + " set `Wait For Completion` to poll until the run finishes and return the full run with its `output`."
    + " Use **List Flows** to find the flow ID, then **Get Run** or **Get Run Result** to read the outcome of an asynchronous run."
    + " [See the documentation](https://docs.puppetflow.com/reference/api/flows#trigger-a-flow)",
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
    input: {
      type: "object",
      label: "Input",
      description: "JSON object merged into `$input` of the flow, e.g. `{\"url\": \"https://example.com\", \"username\": \"user@example.com\"}`."
        + " Keys must match the input names expected by the flow.",
      optional: true,
    },
    waitForCompletion: {
      type: "boolean",
      label: "Wait For Completion",
      description: "Set to `true` to poll the run until it reaches `success`, `error` or `cancelled` and return the full run. e.g. `false`.",
      optional: true,
      default: false,
    },
    pollingInterval: {
      type: "integer",
      label: "Polling Interval (Seconds)",
      description: `Seconds between two status checks when waiting for completion, e.g. \`${DEFAULT_POLL_INTERVAL_SECONDS}\`. Defaults to \`${DEFAULT_POLL_INTERVAL_SECONDS}\`.`,
      optional: true,
      default: DEFAULT_POLL_INTERVAL_SECONDS,
      min: 1,
    },
    timeout: {
      type: "integer",
      label: "Timeout (Seconds)",
      description: `Maximum seconds to wait for completion before failing, e.g. \`${DEFAULT_WAIT_TIMEOUT_SECONDS}\`. Defaults to \`${DEFAULT_WAIT_TIMEOUT_SECONDS}\`, up to \`${MAX_WAIT_TIMEOUT_SECONDS}\`.`
        + " Make sure the workflow execution timeout is at least as long.",
      optional: true,
      default: DEFAULT_WAIT_TIMEOUT_SECONDS,
      min: 1,
      max: MAX_WAIT_TIMEOUT_SECONDS,
    },
  },
  async run({ $ }) {
    const input = parseObject(this.input);
    if (input !== undefined && (typeof input !== "object" || Array.isArray(input))) {
      throw new ConfigurationError("Input must be a JSON object of key-value pairs.");
    }

    const trigger = await this.puppetflow.triggerFlow({
      $,
      flowId: this.flowId,
      data: input,
    });

    if (!this.waitForCompletion) {
      $.export("$summary", `Triggered run #${trigger.run_id} of flow ${this.flowId}`);
      return trigger;
    }

    const deadline = Date.now() + this.timeout * 1000;
    let run;
    do {
      await sleep(this.pollingInterval * 1000);
      run = await this.puppetflow.getRun({
        $,
        flowId: this.flowId,
        runId: trigger.run_id,
      });
      if (TERMINAL_RUN_STATUSES.includes(run.status)) {
        $.export("$summary", `Run #${run.id} of flow ${this.flowId} finished with status ${run.status}`);
        return run;
      }
    } while (Date.now() < deadline);

    throw new Error(`Run #${trigger.run_id} did not complete within ${this.timeout} seconds (last status: ${run.status}). Use Get Run with run ID ${trigger.run_id} to check it later.`);
  },
};
