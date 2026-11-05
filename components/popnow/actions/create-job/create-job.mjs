import { randomUUID } from "crypto";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../popnow.app.mjs";
import {
  DEFAULT_POLL_INTERVAL_SECONDS,
  DEFAULT_WAIT_TIMEOUT_SECONDS,
} from "../../common/constants.mjs";
import {
  isTaskDone,
  parseObject,
  usdToNanos,
} from "../../common/utils.mjs";

export default {
  key: "popnow-create-job",
  name: "Create Job",
  description: "Create an image, video, music or speech generation task. The request is quoted first and the task is only created when the quoted maximum charge is within **Max Cost (USD)**; that amount is held from the API balance and unused funds are released when the task settles. Optionally wait for the task to finish. [See the documentation](https://popnow.ai/docs/tasks)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    modality: {
      propDefinition: [
        app,
        "modality",
      ],
    },
    model: {
      propDefinition: [
        app,
        "model",
        ({ modality }) => ({
          modality,
        }),
      ],
    },
    input: {
      propDefinition: [
        app,
        "input",
      ],
    },
    maxCostUsd: {
      type: "string",
      label: "Max Cost (USD)",
      description: "The most you are willing to pay for this task, as a USD amount such as `0.50`. The action fails without creating a task when the quoted maximum charge is higher. Use **Quote Job** to check the price first.",
    },
    callBackUrl: {
      propDefinition: [
        app,
        "callBackUrl",
      ],
    },
    idempotencyKey: {
      type: "string",
      label: "Idempotency Key",
      description: "A unique key that makes retries of this request safe: repeating a request with the same key returns the original task instead of creating a new one. A random key is generated when left empty. [See the documentation](https://popnow.ai/docs/idempotency)",
      optional: true,
    },
    waitForCompletion: {
      type: "boolean",
      label: "Wait For Completion",
      description: "Pause the workflow and poll the task until it finishes, then return the final task record. Only available in workflows; otherwise the accepted task is returned right away and you can use **Get Job** to read it later.",
      optional: true,
      default: false,
    },
    pollIntervalSeconds: {
      type: "integer",
      label: "Poll Interval (Seconds)",
      description: "Seconds between status checks while waiting for completion.",
      optional: true,
      min: 5,
      default: DEFAULT_POLL_INTERVAL_SECONDS,
    },
    timeoutSeconds: {
      type: "integer",
      label: "Timeout (Seconds)",
      description: "Stop waiting after this many seconds and return the latest task record. The task itself keeps running.",
      optional: true,
      min: 30,
      default: DEFAULT_WAIT_TIMEOUT_SECONDS,
    },
  },
  methods: {
    canRerun($) {
      return typeof $.flow?.rerun === "function";
    },
    maxPolls() {
      const interval = this.pollIntervalSeconds || DEFAULT_POLL_INTERVAL_SECONDS;
      const timeout = this.timeoutSeconds || DEFAULT_WAIT_TIMEOUT_SECONDS;
      return Math.max(1, Math.ceil(timeout / interval));
    },
    scheduleNextPoll($, taskId) {
      const interval = this.pollIntervalSeconds || DEFAULT_POLL_INTERVAL_SECONDS;
      $.flow.rerun(interval * 1000, {
        taskId,
      }, this.maxPolls());
    },
  },
  async run({ $ }) {
    const run = $.context?.run;

    // Later runs only poll the task created by the first run.
    if (run?.runs > 1 && run.context?.taskId) {
      const { taskId } = run.context;
      const task = await this.app.getJob({
        $,
        taskId,
      });
      if (isTaskDone(task)) {
        $.export("$summary", `Task ${taskId} finished with state \`${task.state}\``);
        return task;
      }
      if (run.runs <= this.maxPolls()) {
        this.scheduleNextPoll($, taskId);
        return task;
      }
      $.export("$summary", `Task ${taskId} is still \`${task.state}\` after the timeout. Use Get Job to check it later.`);
      return task;
    }

    const capNanos = usdToNanos(this.maxCostUsd, "Max Cost (USD)");
    const input = parseObject(this.input);

    const quote = await this.app.quoteJob({
      $,
      data: {
        model: this.model,
        input,
        callBackUrl: this.callBackUrl,
      },
    });

    if (usdToNanos(quote.maxChargeUsd, "Quoted maximum charge") > capNanos) {
      throw new ConfigurationError(`The quoted maximum charge for \`${this.model}\` is $${quote.maxChargeUsd}, which is above Max Cost (USD) of $${this.maxCostUsd}. No task was created.`);
    }

    const response = await this.app.createJob({
      $,
      headers: {
        "Idempotency-Key": this.idempotencyKey || randomUUID(),
      },
      data: {
        model: this.model,
        input,
        callBackUrl: this.callBackUrl,
        quoteId: quote.quoteId,
        expectedCostUsd: quote.maxChargeUsd,
      },
    });

    if (this.waitForCompletion && this.canRerun($) && !isTaskDone(response)) {
      this.scheduleNextPoll($, response.taskId);
      return response;
    }

    $.export("$summary", `Successfully created task ${response.taskId} (\`${response.state}\`), holding up to $${response.estimatedCostUsd ?? quote.maxChargeUsd}`);
    return response;
  },
};
