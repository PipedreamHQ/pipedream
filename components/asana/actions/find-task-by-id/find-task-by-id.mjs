import asana from "../../asana.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "asana-find-task-by-id",
  name: "Find Task by ID",
  description: "Searches for a task by id. Returns the complete task record for a single task. [See the docs here](https://developers.asana.com/docs/get-a-task)",
  version: "0.2.1",
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
    const response = await this.asana.getTask(this.task_gid, $);

    $.export("$summary", "Successfully retrieved task");

    return response;
  },
};
