import breeze from "../../breeze.app.mjs";

export default {
  key: "breeze-create-task",
  name: "Create Task",
  description: "Generates a new task within an existing project in breeze. [See documentation](https://www.breeze.pm/api#:~:text=Create%20a%20card)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    breeze,
    projectId: {
      propDefinition: [
        breeze,
        "projectId",
      ],
    },
    stageId: {
      propDefinition: [
        breeze,
        "stageId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    swimlaneId: {
      propDefinition: [
        breeze,
        "swimlaneId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      optional: true,
    },
    taskName: {
      type: "string",
      label: "Task Name",
      description: "The name of the task to create",
    },
    taskDescription: {
      type: "string",
      label: "Task Description",
      description: "The description of the task",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date for the task (format: `YYYY-MM-DD`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      stage_id: this.stageId,
      swimlane_id: this.swimlaneId,
      name: this.taskName,
      description: this.taskDescription,
      due_date: this.dueDate,
    };

    const response = await this.breeze.createTask({
      $,
      projectId: this.projectId,
      data,
    });

    $.export("$summary", `Successfully created task "${this.taskName}"`);

    return response;
  },
};

