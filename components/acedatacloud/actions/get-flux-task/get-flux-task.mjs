import acedatacloud from "../../acedatacloud.app.mjs";
import { requiredText, taskState } from "../../common/utils.mjs";

export default {
  key: "acedatacloud-get-flux-task",
  name: "Get Flux Task",
  description: "Read a Flux task without resubmitting generation. [See the documentation](https://platform.acedata.cloud/documents/flux-tasks)",
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
    taskId: {
      propDefinition: [
        acedatacloud,
        "taskId",
      ],
      description: "The `task_id` returned by **Generate Flux Image**, **Edit Flux Image**, or **Generate Flux Video**, e.g. `01234567-89ab-cdef-0123-456789abcdef`.",
    },
  },
  async run({ $ }) {
    const taskId = requiredText(this.taskId, "Task ID");
    const response = await this.acedatacloud.request({
      $,
      path: "/flux/tasks",
      data: { action: "retrieve", id: taskId },
    });
    const state = taskState(response);
    $.export("$summary", "Flux task " + taskId + ": " + state);
    return { ...response, state };
  },
};
