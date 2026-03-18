import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import { DeleteTaskParams } from "../../types/requestParams";

export default defineAction({
  name: "Delete Task",
  description:
    "Delete a single task by ID. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Task)",
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
      type: "string",
      label: "Task ID",
      description: "The ID of the task to delete.",
      optional: false,
    },
  },
  async run({ $ }): Promise<object> {
    const params: DeleteTaskParams = {
      $,
      taskId: this.taskId,
    };

    const result = await this.infusionsoft.deleteTask(params);

    $.export("$summary", `Successfully deleted task ${this.taskId}`);

    return result;
  },
});
