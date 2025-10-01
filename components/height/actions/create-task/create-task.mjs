import height from "../../height.app.mjs";

export default {
  key: "height-create-task",
  name: "Create Task",
  description: "Creates a new task within your workspace. [See the documentation](https://height.notion.site/Create-a-task-b50565736830422684b28ae570a53a9e)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    height,
    taskName: {
      propDefinition: [
        height,
        "taskName",
      ],
    },
    listIds: {
      propDefinition: [
        height,
        "listIds",
      ],
    },
    description: {
      propDefinition: [
        height,
        "description",
      ],
    },
    status: {
      propDefinition: [
        height,
        "status",
      ],
    },
    assigneeIds: {
      propDefinition: [
        height,
        "assigneeIds",
      ],
    },
    parentTaskId: {
      propDefinition: [
        height,
        "taskId",
      ],
      label: "Parent Task ID",
      description: "The task ID of the parent task",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.height.createTask({
      $,
      data: {
        name: this.taskName,
        listIds: this.listIds,
        description: this.description,
        status: this.status,
        assigneesIds: this.assigneeIds,
        parentTaskId: this.parentTaskId,
      },
    });
    $.export("$summary", `Successfully created task ${this.taskName}`);
    return response;
  },
};
