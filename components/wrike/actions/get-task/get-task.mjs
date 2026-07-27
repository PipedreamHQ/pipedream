// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import wrike from "../../wrike.app.mjs";
import { MAX_LIMIT } from "../../common/constants.mjs";

export default {
  key: "wrike-get-task",
  name: "Get Task",
  description: "Retrieve the full details of one or more Wrike tasks (title, status, importance, dates, responsibles, custom fields) via GET /tasks/{taskIds}. Use this when you already know a task ID and need its complete record. Use **Find Tasks** to discover task IDs within a folder first. Provide the taskId as returned by **Find Tasks**. [See the documentation](https://developers.wrike.com/reference/gettasksmulti)",
  version: "0.0.2",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    wrike,
    taskId: {
      type: "string[]",
      label: "Task IDs",
      description: "The IDs of the tasks to retrieve, e.g. `IEAASDF3KQAAAAAA`. Run the **Find Tasks** action to look up task IDs within a folder. Provide multiple IDs as separate values to fetch several tasks at once. Limit: 1000 tasks per request.",
    },
  },
  async run({ $ }) {
    const taskIds = this.taskId ?? [];
    if (taskIds.length < 1 || taskIds.length > MAX_LIMIT) {
      throw new ConfigurationError(`Provide between 1 and ${MAX_LIMIT} task IDs`);
    }

    const tasks = await this.wrike.getTasks({
      $,
      taskIds: taskIds.join(","),
    });
    $.export("$summary", `Successfully retrieved ${tasks.length} task${tasks.length === 1
      ? ""
      : "s"}`);
    return tasks;
  },
};
