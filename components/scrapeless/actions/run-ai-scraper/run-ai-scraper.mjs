import scrapeless from "../../scrapeless.app.mjs";
import {
  buildAiScraperRequest, validateAiScraperTaskId,
} from "../../common/ai-scraper.mjs";
import {
  assertAiScraperCreateResponse, getAiScraperResultSummary,
} from "../../common/ai-scraper-response.mjs";
import {
  pollAiScraperResult, validateAiScraperWaitSeconds,
} from "../../common/ai-scraper-wait.mjs";

export default {
  key: "scrapeless-run-ai-scraper",
  name: "Run AI Scraper",
  description: "Create one AI Scraper task, wait and query automatically, then return its complete result. Supports eight AI engines. Supply Existing Task ID to query a previous task without creating another; creation inputs are ignored on this path. On timeout, returns task_id for later lookup through this same action. Increase the workflow execution timeout above the wait budget. [See the documentation](https://docs.scrapeless.com/en/docs/ai-scraper/quickstart/task-lifecycle/).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    scrapeless,
    taskId: {
      type: "string",
      label: "Existing Task ID",
      description: "Optional task_id from a previous execution, e.g. `task-example-123`. When supplied, only queries this task; AI Engine, Prompt, Country, AI Mode URL, and Engine Options are ignored. Leave unset to create a new task. Use this field to continue after a waiting timeout without creating a replacement task.",
      optional: true,
    },
    actor: {
      propDefinition: [
        scrapeless,
        "aiScraperActor",
      ],
      optional: true,
      description: "AI engine to run, e.g. `scraper.chatgpt`. Required when creating a task; ignored with Existing Task ID. Copilot and Grok require a mode in Engine Options.",
    },
    prompt: {
      propDefinition: [
        scrapeless,
        "aiScraperPrompt",
      ],
    },
    country: {
      propDefinition: [
        scrapeless,
        "aiScraperCountry",
      ],
    },
    aiModeUrl: {
      propDefinition: [
        scrapeless,
        "aiScraperAiModeUrl",
      ],
    },
    engineOptions: {
      propDefinition: [
        scrapeless,
        "aiScraperEngineOptions",
      ],
    },
    maxWaitSeconds: {
      type: "integer",
      label: "Max Wait Seconds",
      description: "Maximum polling time after creation, e.g. `180`. Integer from 1 to 240, default 180. Queries every 5 seconds, or longer after HTTP 429. Allow another 30 seconds for creation and additional workflow steps in the workflow timeout. A timeout returns the existing task_id; it does not cancel or recreate the task.",
      optional: true,
      default: 180,
    },
  },
  /**
   * Create once, or reuse a supplied ID, and poll until terminal or the wait limit.
   * Export its ID before waiting so interrupted executions can recover it.
   *
   * @param {object} context Pipedream execution context.
   * @param {object} context.$ Step context receiving task ID and summary exports.
   * @returns {Promise<object>} Full terminal result, or explicit timeout details.
   * @throws {Error} If configuration, creation, or a result query fails.
   */
  async run({ $ }) {
    const maxWaitSeconds = validateAiScraperWaitSeconds(this.maxWaitSeconds === undefined
      ? 180
      : this.maxWaitSeconds);
    let taskId;
    if (this.taskId !== undefined) {
      taskId = validateAiScraperTaskId(this.taskId);
    } else {
      const data = buildAiScraperRequest({
        actor: this.actor,
        prompt: this.prompt,
        country: this.country,
        aiModeUrl: this.aiModeUrl,
        engineOptions: this.engineOptions,
      });
      const created = await this.scrapeless.createAiScraperTask({
        $,
        data,
      });
      assertAiScraperCreateResponse(created);
      taskId = created.task_id;
    }
    $.export("task_id", taskId);
    try {
      const result = await pollAiScraperResult({
        taskId,
        maxWaitSeconds,
        /**
         * Query the created task with this iteration's deadline controls.
         *
         * @param {object} options Request timeout and cancellation signal.
         * @returns {Promise<object>} Original task status and result payload.
         */
        getResult: (options) => this.scrapeless.getAiScraperResult({
          $,
          taskId,
          ...options,
        }),
      });
      $.export("$summary", result.status === "timeout"
        ? `Stopped waiting for AI Scraper task ${taskId}; set Existing Task ID to this ID to continue`
        : getAiScraperResultSummary(taskId, result));
      return result;
    } catch (error) {
      error.task_id = taskId;
      throw error;
    }
  },
};
