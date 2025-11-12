import asana from "../../asana.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "asana-find-task-by-id",
  name: "Find Task by ID",
  description: "Searches for a task by id. Returns the complete task record for a single task. [See the documentation](https://developers.asana.com/docs/get-a-task)",
  version: "0.2.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    task_gid: {
      label: "Task GID",
      description: "The ID of the task to update.",
      type: "string",
      propDefinition: [
        asana,
        "tasks",
        (c) => ({
          project: c.project,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { data: response } = await this.asana.getTask({
      taskId: this.task_gid,
      $,
    });

    $.export("$summary", "Successfully retrieved task");

    return response;
  },
};
