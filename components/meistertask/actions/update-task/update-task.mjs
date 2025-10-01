import meistertask from "../../meistertask.app.mjs";

export default {
  key: "meistertask-update-task",
  name: "Update Task",
  description: "Updaets an existing task in a project section. [See the docs](https://developers.meistertask.com/reference/put-task)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    meistertask,
    projectId: {
      propDefinition: [
        meistertask,
        "projectId",
      ],
      optional: true,
    },
    currentSection: {
      propDefinition: [
        meistertask,
        "sectionId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      label: "Current Task Section",
      description: "The section the task is currently in",
      optional: true,
    },
    taskId: {
      propDefinition: [
        meistertask,
        "taskId",
        (c) => ({
          projectId: c.projectId,
          sectionId: c.currentSection,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the task",
      optional: true,
    },
    assignedTo: {
      propDefinition: [
        meistertask,
        "personId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      label: "Assignee",
      description: "The ID of the person to whom the task is assigned",
      optional: true,
    },
    due: {
      type: "string",
      label: "Due Date",
      description: "The due date and time of the task in ISO 8601 format.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "The description of the task.",
      optional: true,
    },
    sectionId: {
      propDefinition: [
        meistertask,
        "sectionId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      label: "New Task Section",
      description: "The section to move the task to",
      optional: true,
    },
    status: {
      propDefinition: [
        meistertask,
        "taskStatus",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
      assigned_to_id: this.assignedTo,
      due: this.due,
      notes: this.notes,
      section_id: this.sectionId,
      status: this.status,
    };
    const response = await this.meistertask.updateTask({
      $,
      data,
      taskId: this.taskId,
    });
    if (response) {
      $.export("$summary", `Successfully updated task with ID ${response.id}`);
    }
    return response;
  },
};
