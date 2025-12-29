import apify from "../../apify.app.mjs";
import {
  ACTOR_JOB_STATUSES, ACTOR_JOB_TERMINAL_STATUSES, WEBHOOK_EVENT_TYPES,
} from "@apify/consts";

export default {
  key: "apify-run-task",
  name: "Run Task",
  description: "Run a specific task and optionally wait for its termination. Not for use with Pipedream Connect. [See the documentation](https://docs.apify.com/api/v2/actor-task-runs-post)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    apify,
    info: {
      type: "alert",
      alertType: "info",
      content: "Not for use with Pipedream Connect. `$.flow` and `$.context` are not supported in Pipedream Connect.",
    },
    taskId: {
      propDefinition: [
        apify,
        "taskId",
        () => ({
          desc: true,
        }),
      ],
      description: "The ID of the task to run",
    },
    waitForFinish: {
      type: "boolean",
      label: "Wait For Finish",
      description: "If false, returns immediately after starting the task. If true, waits for task completion (via webhook or polling) and returns dataset items.",
      default: true,
    },
    overrideInput: {
      type: "string",
      label: "Override Input",
      description: "Optional JSON string to override the default input for the task run. Must be valid JSON.",
      optional: true,
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "Optional timeout for the run, in seconds. By default, the run uses a timeout specified in the task settings.",
      optional: true,
    },
    memory: {
      type: "integer",
      label: "Memory",
      description: "Memory limit for the run, in megabytes. The amount of memory can be set to a power of 2 with a minimum of 128. By default, the run uses a memory limit specified in the task settings.",
      optional: true,
    },
    build: {
      type: "string",
      label: "Build",
      description: "Specifies the Actor build to run. It can be either a build tag or build number. By default, the run uses the build specified in the task settings (typically latest).",
      optional: true,
    },
  },
  async run({ $ }) {
    const POLL_INTERVAL_MS = 30_000; // 30s
    const POLL_WINDOW_MS = 24 * 60 * 60 * 1000; // 1 day
    let input;

    if (this.overrideInput) {
      try {
        input = JSON.parse(this.overrideInput);
      } catch (error) {
        throw new Error(`Failed to parse override Input JSON: ${error.message}`);
      }
    }

    // Helper: start task
    const startTask = async () => {
      return this.apify.runTask({
        taskId: this.taskId,
        params: {
          timeout: this.timeout,
          memory: this.memory,
          build: this.build,
        },
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
        ($.context.run?.context && $.context.run.context.pollStartMs) ||
        $.context.pollStartMs ||
        Date.now();

      // Persist the poll start time and webhook ID across reruns
      $.flow.rerun(POLL_INTERVAL_MS, {
        apifyRunId: runId,
        pollStartMs: startEpoch,
        webhookId,
      });
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
    const resumeBody = $.$resume_data && $.$resume_data.body;

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
      if (elapsed > POLL_WINDOW_MS) {
        // Clean up webhook before timing out
        await deleteWebhook(webhookId);
        throw new Error(
          `Polling window exceeded (>${POLL_WINDOW_MS} ms). Task did not finish in time.`,
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
    const { resume_url } = $.flow.suspend(POLL_WINDOW_MS); // 1-day timeout for task run to finish

    // Create a webhook pointing to resume_url
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
      throw new Error("Failed to create webhook - no ID returned");
    }

    $.context.webhookId = webhook.id;

    // Fallback polling via rerun: every 30s, within a 1-day window
    schedulePoll(started.id, webhook.id);

    // Execution suspends at $.flow.suspend; webhook or rerun will resume.
  },
};
