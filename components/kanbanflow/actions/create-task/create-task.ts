import kanbanflow from "../../app/kanbanflow.app";
import { defineAction } from "@pipedream/types";
import {
  CreateTaskParams
} from "../../common/types";

export default defineAction({
  name: "Create Task",
  description:
    "Create a task (docs available on board settings)",
  key: "kanbanflow-create-task",
  version: "0.0.1",
  type: "action",
  props: {
    kanbanflow,
    name: {
      label: "Name",
      description: "Task name.",
      type: "string",
    },
  },
  async run({ $ }): Promise<object> {
    const params: CreateTaskParams = {
      $,
      data: {

      }
    };
    const data: object = await this.kanbanflow.createTask(params);

    $.export("$summary", `Verified email`);

    return data;
  },
});
