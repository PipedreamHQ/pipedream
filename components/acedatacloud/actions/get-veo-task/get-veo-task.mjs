import acedatacloud from "../../acedatacloud.app.mjs";
import { requiredText, taskState } from "../../common/utils.mjs";

export default {
  key: "acedatacloud-get-veo-task",
  name: "Get Veo Task",
  description: "Read a Veo task without resubmitting generation. [See the documentation](https://platform.acedata.cloud/documents/veo-tasks)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    acedatacloud,
    taskId: { type: "string", label: "Task ID", description: "The task_id returned by a Veo submission action, e.g. `01234567-89ab-cdef-0123-456789abcdef`." },
  },
  async run({ $ }) {
    const taskId = requiredText(this.taskId, "Task ID");
    const response = await this.acedatacloud.request({
      $,
      path: "/veo/tasks",
      data: { action: "retrieve", id: taskId },
    });
    const state = taskState(response);
    $.export("$summary", "Veo task " + taskId + ": " + state);
    return { ...response, state };
  },
};
