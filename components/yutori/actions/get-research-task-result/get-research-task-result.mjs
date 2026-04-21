import yutori from "../../yutori.app.mjs";

export default {
  key: "yutori-get-research-task-result",
  name: "Get Research Task Result",
  description: "Fetch the current status and result of a research task started with **Run Research Task**. Place a **Delay** step (15 minutes recommended) before this action to give the task time to complete. Research tasks typically take 5–15 minutes. If the task is still running, the step returns the current status — re-run or increase the delay if needed. [See the documentation](https://docs.yutori.com/reference/research-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: true,
  },
  props: {
    yutori,
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The task ID returned by the **Run Research Task** step, e.g. `{{steps.run_research_task.$return_value.task_id}}`",
    },
  },
  async run({ $ }) {
    const result = await this.yutori.getResearchTask($, this.taskId);
    $.export("$summary", `Research task ${result.status}: ${this.taskId}`);
    return result;
  },
};
