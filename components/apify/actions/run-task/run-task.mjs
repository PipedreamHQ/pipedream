import apify from "../../apify.app.mjs";
import {
  buildMemoryProp, getMemoryLimits, validateMemory,
} from "../../common/memory.mjs";
import {
  ACTOR_JOB_STATUSES, ACTOR_JOB_TERMINAL_STATUSES,
} from "@apify/consts";
import { ConfigurationError } from "@pipedream/platform";

// How long to wait for the run in-step: just under Pipedream's 750 s maximum
// workflow timeout. Longer tasks belong to the New Finished Task Run trigger.
const WAIT_SECS = 720;

export default {
  key: "apify-run-task",
  name: "Run task",
  description: "Run a specific task and optionally wait for its termination. [See the documentation](https://docs.apify.com/api/v2/actor-task-runs-post)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    apify,
    taskId: {
      propDefinition: [
        apify,
        "taskId",
        () => ({
          desc: true,
        }),
      ],
      description: "The ID of the task to run, e.g. `tRa3Nv8Qz2mKpL7wX`",
      reloadProps: true,
    },
    waitForFinish: {
      type: "boolean",
      label: "Wait for finish",
      description:
                "If `true` (default), the step waits up to 720 seconds (or the workflow's timeout, if shorter) for the task run to finish and returns `{ run }`, including the default dataset ID; use the **Get Dataset Items** action to fetch the results. The step fails if the run doesn't succeed or is still running after 720 seconds; use the **New Finished Task Run (Instant)** trigger for longer tasks. If `false`, the step starts the run and returns `{ run }` immediately.",
      default: true,
    },
    overrideInput: {
      type: "string",
      label: "Override Input (JSON)",
      description: "Optional JSON object to override the task's saved input for this run. Leave empty to use the task's saved input. Must be valid JSON (e.g. `{}` for empty input).",
      optional: true,
    },
    timeout: {
      type: "integer",
      label: "Timeout (seconds)",
      description: "Optional timeout for the run, in seconds (e.g. `120`). By default, the run uses a timeout specified in the task settings.",
      optional: true,
    },
    build: {
      type: "string",
      label: "Build",
      description: "Specifies the Actor build to run, e.g. `latest` or `1.2.3`. It can be either a build tag or build number. By default, the run uses the build specified in the task settings (typically latest).",
      optional: true,
      reloadProps: true,
    },
  },
  methods: {
    async taskMemoryLimits() {
      if (!this.taskId) {
        return getMemoryLimits();
      }
      const task = await this.apify.getTask(this.taskId);
      const build = task?.actId
        ? await this.apify.getBuild(task.actId, this.build || task.options?.build)
        : null;
      return getMemoryLimits(build);
    },
  },
  async additionalProps() {
    let memoryLimits;
    try {
      memoryLimits = await this.taskMemoryLimits();
    } catch {
      memoryLimits = getMemoryLimits();
    }
    return {
      memory: buildMemoryProp(memoryLimits),
    };
  },

  async run({ $ }) {
    let input;

    if (this.overrideInput) {
      try {
        input = JSON.parse(this.overrideInput);
      } catch (error) {
        throw new ConfigurationError(`Failed to parse Override Input JSON: ${error.message}`);
      }
      // The task input must be a JSON object; reject null, arrays, and primitives.
      if (input === null || typeof input !== "object" || Array.isArray(input)) {
        throw new ConfigurationError("Override Input must be a JSON object (e.g. `{}`).");
      }
    }

    const params = {
      timeout: this.timeout,
      build: this.build,
    };
    // Validate memory when set; empty uses task's saved value.
    if (this.memory) {
      params.memory = validateMemory(this.memory, await this.taskMemoryLimits());
    }

    if (!this.waitForFinish) {
      const run = await this.apify.runTask({
        taskId: this.taskId,
        params,
        input,
      });
      $.export("$summary", `Started run ${run.id} of task ${this.taskId}. Not waiting for it to finish.`);
      return {
        run,
      };
    }

    const run = await this.apify.callTask({
      taskId: this.taskId,
      params,
      input,
      waitSecs: WAIT_SECS,
    });
    const consoleUrl = run.consoleUrl ?? `https://console.apify.com/view/runs/${run.id}`;

    if (!ACTOR_JOB_TERMINAL_STATUSES.includes(run.status)) {
      throw new Error(
        `Run ${run.id} of task ${this.taskId} did not finish within ${WAIT_SECS} seconds (status ${run.status}) and keeps running on Apify. Use the "New Finished Task Run (Instant)" trigger to react to long-running tasks. See console: ${consoleUrl}`,
      );
    }

    if (run.status !== ACTOR_JOB_STATUSES.SUCCEEDED) {
      throw new Error(
        `Apify task run ${run.id} finished with status ${run.status}. See console: ${consoleUrl}`,
      );
    }

    $.export("$summary", `Task ${this.taskId} succeeded.`);
    return {
      run,
    };
  },
};
