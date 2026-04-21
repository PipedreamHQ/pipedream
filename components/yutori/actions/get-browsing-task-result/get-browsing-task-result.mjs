import yutori from "../../yutori.app.mjs";

export default {
  key: "yutori-get-browsing-task-result",
  name: "Get Browsing Task Result",
  description: "Fetch the current status and result of a browsing task started with **Run Browsing Task**. Place a **Delay** step (15 minutes recommended) before this action to give the task time to complete. If the task is still running, the step returns the current status — re-run or increase the delay if needed. [See the documentation](https://docs.yutori.com/reference/browsing-get)",
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
      description: "The task ID returned by the **Run Browsing Task** step, e.g. `{{steps.run_browsing_task.$return_value.task_id}}`",
    },
  },
  async run({ $ }) {
    const result = await this.yutori.getBrowsingTask($, this.taskId);
    $.export("$summary", `Browsing task ${result.status}: ${this.taskId}`);
    return result;
  },
};
