import asana from "../../asana.app.mjs";

export default {
  key: "asana-list-task-fields",
  name: "List Task Fields",
  description: "Returns the field names present on tasks in an Asana project, for use with the Task Fields prop on webhook triggers such as **Task Field Updated in Project**. Fetches one existing task from the project and returns its top-level property names (e.g. `name`, `assignee`, `due_on`, `completed`). Requires the project to contain at least one task. Example: call with `project: '1204567890123456'` → returns `['gid', 'resource_type', 'name', 'assignee', 'due_on', 'completed', ...]`. [See the documentation](https://developers.asana.com/reference/gettask)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    asana,
    project: {
      propDefinition: [
        asana,
        "projects",
      ],
      description: "The project GID to sample a task from (e.g. `1204567890123456`). Use **Search Projects** to find available project GIDs.",
    },
  },
  async run({ $ }) {
    const { data: tasks } = await this.asana.getTasks({
      params: {
        project: this.project,
        limit: 1,
      },
      $,
    });

    if (!tasks?.length) {
      $.export("$summary", "No tasks found in this project — unable to determine field names");
      return [];
    }

    const { data: task } = await this.asana.getTask({
      taskId: tasks[0].gid,
      $,
    });

    const fields = Object.keys(task);
    $.export("$summary", `Found ${fields.length} field${fields.length === 1
      ? ""
      : "s"}`);
    return fields;
  },
};
