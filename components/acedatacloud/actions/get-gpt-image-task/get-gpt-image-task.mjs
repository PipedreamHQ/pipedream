import acedatacloud from "../../acedatacloud.app.mjs";
import { requiredText, taskState } from "../../common/utils.mjs";

export default {
  key: "acedatacloud-get-gpt-image-task",
  name: "Get GPT Image Task",
  description: "Read a GPT Image task without resubmitting generation. [See the documentation](https://platform.acedata.cloud/documents/openai-tasks)",
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
    taskId: { type: "string", label: "Task ID", description: "The task_id returned by a GPT Image submission action, e.g. `01234567-89ab-cdef-0123-456789abcdef`." },
  },
  async run({ $ }) {
    const taskId = requiredText(this.taskId, "Task ID");
    const response = await this.acedatacloud.request({
      $,
      path: "/openai/tasks",
      data: { action: "retrieve", id: taskId },
    });
    const state = taskState(response);
    $.export("$summary", "GPT Image task " + taskId + ": " + state);
    return { ...response, state };
  },
};
