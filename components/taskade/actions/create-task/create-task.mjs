import taskade from "../../taskade.app.mjs";

export default {
  key: "taskade-create-task",
  name: "Create Task",
  description: "Creates a new task in a Taskade project."
    + " Use **List Projects** to find the project ID."
    + " To add a date after you create the task, use **Set Task Due Date** with the returned task ID."
    + " [See the documentation](https://docs.taskade.com/developers/comprehensive-api-guide/tasks/create-task)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    taskade,
    projectId: {
      propDefinition: [
        taskade,
        "projectId",
      ],
    },
    content: {
      propDefinition: [
        taskade,
        "content",
      ],
    },
    contentType: {
      propDefinition: [
        taskade,
        "contentType",
      ],
    },
    placement: {
      type: "string",
      label: "Placement",
      description: "Where to add the task in the project."
        + " One of `afterbegin` (top of the project), `beforeend` (bottom of the project). e.g. `beforeend`.",
      options: [
        "afterbegin",
        "beforeend",
      ],
    },
    assignees: {
      propDefinition: [
        taskade,
        "assignees",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const task = await this.taskade.createTask({
      $,
      projectId: this.projectId,
      data: {
        tasks: [
          {
            content: this.content,
            contentType: this.contentType,
            placement: this.placement,
          },
        ],
      },
    });
    const taskId = task.item[0].id;
    if (this.assignees?.length) {
      await this.taskade.assignTask({
        $,
        projectId: this.projectId,
        taskId,
        data: {
          handles: this.assignees,
        },
      });
    }
    $.export("$summary", `Successfully created task with ID ${taskId}`);
    return task;
  },
};
