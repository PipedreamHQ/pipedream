import asana from "../../asana.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "asana-find-task-by-id",
  name: "Find Task by ID",
  description: "Retrieves the complete record for a single Asana task by its GID. Use this to fetch full task details (description, assignee, due date, custom fields) after obtaining a task GID from **Search Tasks**. Use `optFields` to request additional fields not returned by default. Example: call with `task_gid: '1202345678901234'`, `optFields: ['due_on','assignee','custom_fields']` → returns the full task record for that GID. [See the documentation](https://developers.asana.com/docs/get-a-task)",
  version: "0.3.1",
  ai: "optimized",
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
      description: "The ID of the task to retrieve, e.g. `1202345678901234`. Use **Search Tasks** to find available task GIDs.",
      type: "string",
      propDefinition: [
        asana,
        "tasks",
      ],
    },
    optFields: {
      propDefinition: [
        asana,
        "optFields",
      ],
      description: "Optional task properties to include in the response (e.g. `created_at`, `due_on`, `custom_fields`). Nested paths are allowed; `gid` is always returned. [See the documentation](https://developers.asana.com/docs/get-a-task)",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data: response } = await this.asana.getTask({
      taskId: this.task_gid,
      params: {
        opt_fields: this.optFields?.length
          ? this.optFields.join(",")
          : undefined,
      },
      $,
    });

    $.export("$summary", "Successfully retrieved task");

    return response;
  },
};
