import taskade from "../../taskade.app.mjs";

export default {
  key: "taskade-list-tasks",
  name: "List Tasks",
  description: "Lists the tasks of a Taskade project in document order, subtasks included."
    + " Each task has an `id`, its `text`, a `completed` flag and the `parentId` of its parent task."
    + " Use the `id` with **Complete Task**, **Update Task**, **Assign Task**, **Set Task Due Date** or **Delete Task**."
    + " Use **List Projects** to find the project ID."
    + " [See the documentation](https://docs.taskade.com/developers/comprehensive-api-guide/projects/get-project-tasks)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    taskade,
    projectId: {
      propDefinition: [
        taskade,
        "projectId",
      ],
    },
    maxResults: {
      propDefinition: [
        taskade,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const items = this.taskade.paginate({
      resourceFn: this.taskade.listTasks,
      args: {
        $,
        projectId: this.projectId,
      },
      resourceType: "items",
      max: this.maxResults,
    });
    const tasks = [];
    for await (const item of items) {
      tasks.push(item);
    }
    $.export("$summary", `Successfully retrieved ${tasks.length} task${tasks.length === 1
      ? ""
      : "s"}`);
    return tasks;
  },
};
