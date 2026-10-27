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
      description: "The task_id returned by **Create AI Scraper Task**, for example task-example-123. Query the same ID while pending or running; do not create another task to check progress.",
    },
  },
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
