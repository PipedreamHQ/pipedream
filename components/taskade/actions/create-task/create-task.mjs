import taskade from "../../taskade.app.mjs";

export default {
  key: "taskade-create-task",
  name: "Create Task",
  description: "Creates a new task in Taskade. [See the documentation](https://developers.taskade.com/docs/api/tasks/create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    taskade,
    projectId: {
      propDefinition: [
        taskade,
        "projectId",
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "Content of the task",
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "The type of content",
      options: [
        "text/markdown",
        "text/plain",
      ],
    },
    placement: {
      type: "string",
      label: "Placement",
      description: "Placement of the task",
      options: [
        "afterbegin",
        "beforeend",
      ],
    },
    assignees: {
      type: "string[]",
      label: "Assignees",
      description: "An array of user handles to assign to the task",
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
