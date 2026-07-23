// x-pd-ai: optimized
import wrike from "../../wrike.app.mjs";

export default {
  key: "wrike-get-task",
  name: "Get Task",
  description: "Retrieve the full details of one or more Wrike tasks (title, status, importance, dates, responsibles, custom fields) via GET /tasks/{taskIds}. Use this when you already know a task ID and need its complete record. Use **Find Tasks** to discover task IDs within a folder first. Provide the taskId as returned by **Find Tasks**. [See the documentation](https://developers.wrike.com/reference/gettasksmulti)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    wrike,
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task to retrieve, e.g. `IEAASDF3KQAAAAAA`. Run the **Find Tasks** action to look up task IDs within a folder. Comma-separate multiple IDs to fetch several tasks at once.",
    },
  },
  async run({ $ }) {
    const tasks = await this.wrike.getTasks({
      $,
      taskIds: this.taskId,
    });
    $.export("$summary", `Successfully retrieved ${tasks.length} task${tasks.length === 1
      ? ""
      : "s"}`);
    return tasks;
  },
};
