import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import { DeleteTaskParams } from "../../common/types/requestParams";

export default defineAction({
  name: "Delete Task",
  description:
    "Delete a single task by ID. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Task/operation/deleteTask)",
  key: "infusionsoft-delete-task",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    infusionsoft,
    taskId: {
      propDefinition: [
        infusionsoft,
        "taskId",
      ],
    },
  },
  async run({ $ }): Promise<object> {
    const taskId = String(this.taskId ?? "").trim();
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    const params: DeleteTaskParams = {
      $,
      taskId,
    };

    const result = await this.infusionsoft.deleteTask(params);

    $.export("$summary", `Successfully deleted task ${taskId}`);

    return result;
  },
});
