import scrapeless from "../../scrapeless.app.mjs";
import { validateAiScraperTaskId } from "../../common/ai-scraper.mjs";
import {
  assertAiScraperResultResponse, getAiScraperResultSummary,
} from "../../common/ai-scraper-response.mjs";

export default {
  key: "scrapeless-get-ai-scraper-result",
  name: "Get AI Scraper Result",
  description: "Query an AI Scraper task once. Returns pending, running, success, or failed and the full original payload. Use the task_id from **Create AI Scraper Task**. Save completed results within 4 minutes. [See the documentation](https://docs.scrapeless.com/en/docs/ai-scraper/quickstart/task-lifecycle/).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    scrapeless,
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The task_id returned by **Create AI Scraper Task**, e.g. `task-example-123`. Query the same ID while pending or running; do not create another task to check progress.",
    },
  },
  /**
   * Query one existing task and export a summary of its reported state.
   * Return terminal failures as API data without creating a replacement task.
   *
   * @param {object} context Pipedream execution context.
   * @param {object} context.$ Step context used to export the status summary.
   * @returns {Promise<object>} Unmodified task response, including task_result.
   * @throws {Error} If the task ID, transport, or response status is invalid.
   */
  async run({ $ }) {
    const taskId = validateAiScraperTaskId(this.taskId);
    const response = await this.scrapeless.getAiScraperResult({
      $,
      taskId,
    });
    assertAiScraperResultResponse(response);
    $.export("$summary", getAiScraperResultSummary(taskId, response));
    return response;
  },
};
