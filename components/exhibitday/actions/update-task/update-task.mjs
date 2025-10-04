import exhibitday from "../../exhibitday.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "exhibitday-update-task",
  name: "Update Task",
  description: "Updates an existing task in ExhibitDay. [See the documentation](https://api.exhibitday.com/Help/V1?epf=2)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    exhibitday,
    eventId: {
      propDefinition: [
        exhibitday,
        "eventId",
      ],
    },
    taskId: {
      propDefinition: [
        exhibitday,
        "taskId",
        (c) => ({
          eventId: c.eventId,
        }),
      ],
    },
    taskName: {
      propDefinition: [
        exhibitday,
        "taskName",
      ],
      optional: true,
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
    const data = utils.cleanObject({
      id: this.taskId,
      name: this.taskName,
      event_id: this.eventId,
      task_section_id: this.taskSectionId,
      is_completed: this.isCompleted,
      due_date: this.dueDate,
      assignee_user_id: this.assigneeId,
      details: this.details,
    });

    const response = await this.exhibitday.updateTask({
      $,
      data,
    });

    if (response) {
      $.export("$summary", `Successfully updated task with ID ${this.taskId}.`);
    }

    return response;
  },
};
