import apify from "../../apify.app.mjs";
import {
  buildMemoryProp, getMemoryLimits, validateMemory,
} from "../../common/memory.mjs";
import {
  ACTOR_JOB_STATUSES, ACTOR_JOB_TERMINAL_STATUSES, WEBHOOK_EVENT_TYPES,
} from "@apify/consts";
import { ConfigurationError } from "@pipedream/platform";

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
      description: "The ID of the task to run",
      reloadProps: true,
    },
    waitForFinish: {
      type: "boolean",
      label: "Wait for finish",
      description:
                "If false, returns immediately after starting the task. If true, waits for the task run to finish and returns the run details (including the default dataset ID). Use the **Get dataset items** action to fetch the results.",
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
      description: "Optional timeout for the run, in seconds. By default, the run uses a timeout specified in the task settings.",
      optional: true,
    },
    build: {
      type: "string",
      label: "Build",
      description: "Specifies the Actor build to run. It can be either a build tag or build number. By default, the run uses the build specified in the task settings (typically latest).",
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
    const pollIntervalMs = 30_000; // 30s
    const pollWindowMs = 24 * 60 * 60 * 1000; // 1 day
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

    // Helper: start task
    const startTask = async () => {
      const params = {
        timeout: this.timeout,
        build: this.build,
      };
      // Validate memory when set; empty uses task's saved value.
      if (this.memory) {
        params.memory = validateMemory(this.memory, await this.taskMemoryLimits());
      }
      return this.apify.runTask({
        taskId: this.taskId,
        params,
        input,
      });
    };

    // Helper: delete webhook
    const deleteWebhook = async (webhookId) => {
      if (!webhookId) return;

      try {
        await this.apify.deleteHook(webhookId);
      } catch (webhookError) {
        console.warn("Failed to delete webhook (non-critical):", webhookError.message);
      }
    };

    // Helper: schedule next poll (rerun) with 30s interval and 1-day cap
    const schedulePoll = (runId, webhookId) => {
      const startEpoch =
                $.context.run?.context?.pollStartMs ||
                $.context.pollStartMs ||
                Date.now();

      // Persist the poll start time and webhook ID across reruns
      const maxRetries = Math.ceil(pollWindowMs / pollIntervalMs);
      $.flow.rerun(pollIntervalMs, {
        apifyRunId: runId,
        pollStartMs: startEpoch,
        webhookId,
      }, maxRetries);
    };

    // 1) ONLY START (no waiting)
    if (!this.waitForFinish) {
      const started = await startTask();
      $.export(
        "$summary",
        `Started task ${this.taskId}. Not waiting for completion.`,
      );
      return {
        runId: started.id,
        status: ACTOR_JOB_STATUSES.RUNNING,
      };
    }

    // RERUN CONTEXT (if we scheduled $.flow.rerun previously)
    const runCtx = $.context.run || {};
    const rerunContext = runCtx.context || {};
    const isRerun = typeof runCtx.runs === "number" && runCtx.runs > 1;

    // RESUME DATA (if the webhook called the resume_url)
    const resumeBody = $.$resume_data?.body;

    // 3) RERUN/RESUME BEHAVIOR
    if (resumeBody || isRerun) {
      const runId =
                resumeBody?.runId ||
                rerunContext.apifyRunId ||
                $.context.apifyRunId;

      const webhookId =
                rerunContext.webhookId ||
                $.context.webhookId;

      if (!runId) {
        throw new Error("Missing runId on rerun/resume.");
      }

      // Enforce a 1-day cap for polling
      const pollStartMs = rerunContext.pollStartMs || $.context.pollStartMs || Date.now();
      const elapsed = Date.now() - pollStartMs;
      if (elapsed > pollWindowMs) {
        // Clean up webhook before timing out
        await deleteWebhook(webhookId);
        throw new Error(
          `Polling window exceeded (>${pollWindowMs} ms). Task did not finish in time.`,
        );
      }

      // Try to fetch an outcome
      const run = await this.apify.getRun({
        runId,
      });
      const { status } = run;

      // If finished
      if (ACTOR_JOB_TERMINAL_STATUSES.includes(status)) {
        // Clean up webhook
        await deleteWebhook(webhookId);

        // If finished successfully
        if (status === ACTOR_JOB_STATUSES.SUCCEEDED) {
          $.export(
            "$summary",
            `Task ${this.taskId} succeeded.`,
          );

          return run;
        }

        // If finished with an error status
        throw new Error(
          `Apify run ${runId} finished with status ${status}. See console: ${run?.consoleUrl}`,
        );
      }

      // Still running: schedule another poll
      schedulePoll(runId, webhookId);
      return; // execution pauses until next rerun
    }

    // 2) START AND INSTALL WEBHOOK (initial execution)
    const started = await startTask();

    $.context.apifyRunId = started.id;
    $.context.startTime = Date.now();
    $.context.pollStartMs = Date.now(); // track the start of a polling window

    // Create a resume link and suspend
    const { resume_url } = $.flow.suspend(pollWindowMs); // 1-day timeout for task run to finish

    // Create a webhook pointing to resume_url. If this fails, fall back to
    // polling only: the task has already started, so throwing here would fail
    // the action and a workflow retry would start the task again (duplicate
    // side effects). Polling below resolves the run without the webhook.
    let webhookId;
    try {
      const webhook = await this.apify.createHook({
        requestUrl: resume_url,
        eventTypes: [
          WEBHOOK_EVENT_TYPES.ACTOR_RUN_SUCCEEDED,
          WEBHOOK_EVENT_TYPES.ACTOR_RUN_FAILED,
          WEBHOOK_EVENT_TYPES.ACTOR_RUN_ABORTED,
          WEBHOOK_EVENT_TYPES.ACTOR_RUN_TIMED_OUT,
        ],
        condition: {
          actorRunId: started.id,
        },
        payloadTemplate: JSON.stringify({
          runId: "{{resource.id}}",
          status: "{{resource.status}}",
          defaultDatasetId: "{{resource.defaultDatasetId}}",
          startedAt: "{{resource.startedAt}}",
          finishedAt: "{{resource.finishedAt}}",
          eventType: "{{eventType}}",
        }),
        headersTemplate: JSON.stringify({
          "Content-Type": "application/json",
        }),
        shouldInterpolateStrings: true,
        description: `Pipedream auto-resume for task ${this.taskId} run ${started.id}`,
      });

      if (!webhook?.id) {
        throw new Error("webhook creation returned no ID");
      }

      webhookId = webhook.id;
      $.context.webhookId = webhookId;
    } catch (webhookError) {
      console.warn(
        "Failed to create resume webhook; falling back to polling (non-critical):",
        webhookError.message,
      );
    }

    // Fallback polling via rerun: every 30s, within a 1-day window
    schedulePoll(started.id, webhookId);

    // Execution suspends at $.flow.suspend; webhook or rerun will resume.
  },
};
