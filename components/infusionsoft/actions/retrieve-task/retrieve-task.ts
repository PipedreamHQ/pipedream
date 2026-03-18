import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Retrieve Task",
  description:
    "Retrieve a single task by ID. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Task)",
  key: "infusionsoft-retrieve-task",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    infusionsoft,
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task to retrieve.",
      optional: false,
    },
  },
  async run({ $ }): Promise<object> {
    const result = await this.infusionsoft.retrieveTask({
      $,
      taskId: this.taskId,
    });

    $.export("$summary", `Successfully retrieved task ${this.taskId}`);

    return result;
  },
});
