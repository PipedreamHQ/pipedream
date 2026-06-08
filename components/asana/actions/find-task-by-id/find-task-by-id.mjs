import asana from "../../asana.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "asana-find-task-by-id",
  name: "Find Task by ID",
  description: "Searches for a task by id. Returns the complete task record for a single task. [See the documentation](https://developers.asana.com/docs/get-a-task)",
  version: "0.2.15",
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
    optFields: {
      propDefinition: [
        asana,
        "optFields",
      ],
      description: "Optional task properties to include in the response (e.g. `created_at`, `due_on`, `custom_fields`). Nested paths are allowed; `gid` is always returned.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data: response } = await this.asana.getTask({
      taskId: this.task_gid,
      params: {
        opt_fields: Array.isArray(this.optFields) && this.optFields.length
          ? this.optFields.join(",")
          : undefined,
      },
      $,
    });

    $.export("$summary", "Successfully retrieved task");

    return response;
  },
};
