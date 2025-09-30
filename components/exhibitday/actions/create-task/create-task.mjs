import exhibitday from "../../exhibitday.app.mjs";

export default {
  key: "exhibitday-create-task",
  name: "Create Task",
  description: "Creates a new task in ExhibitDay. [See the documentation](https://api.exhibitday.com/Help/V1?epf=2)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    exhibitday,
    taskName: {
      propDefinition: [
        exhibitday,
        "taskName",
      ],
    },
    eventId: {
      propDefinition: [
        exhibitday,
        "eventId",
      ],
    },
    taskSectionId: {
      propDefinition: [
        exhibitday,
        "taskSectionId",
        (c) => ({
          eventId: c.eventId,
        }),
      ],
    },
    isCompleted: {
      propDefinition: [
        exhibitday,
        "isCompleted",
      ],
    },
    dueDate: {
      propDefinition: [
        exhibitday,
        "dueDate",
      ],
    },
    assigneeId: {
      propDefinition: [
        exhibitday,
        "assigneeId",
      ],
    },
    details: {
      propDefinition: [
        exhibitday,
        "details",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.exhibitday.createTask({
      $,
      data: {
        name: this.taskName,
        event_id: this.eventId,
        task_section_id: this.taskSectionId,
        is_completed: this.isCompleted,
        due_date: this.dueDate,
        assignee_user_id: this.assigneeId,
        details: this.details,
      },
    });

    if (response?.id) {
      $.export("$summary", `Successfully created task with ID ${response?.id}.`);
    }

    return response;
  },
};
