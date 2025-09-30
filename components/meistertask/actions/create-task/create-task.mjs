import meistertask from "../../meistertask.app.mjs";

export default {
  key: "meistertask-create-task",
  name: "Create Task",
  description: "Create a new task in a project section. [See the docs](https://developers.meistertask.com/reference/post-task)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    },
    sectionId: {
      propDefinition: [
        meistertask,
        "sectionId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the task",
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
    status: {
      propDefinition: [
        meistertask,
        "taskStatus",
      ],
      optional: true,
    },
    labels: {
      propDefinition: [
        meistertask,
        "labelId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      type: "string[]",
      label: "Labels",
      description: "The labels to assign to this task. These must exist in the project.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
      assigned_to_id: this.assignedTo,
      due: this.due,
      notes: this.notes,
      status: this.status,
      label_ids: this.labels,
    };
    const response = await this.meistertask.createTask({
      $,
      data,
      sectionId: this.sectionId,
    });
    if (response) {
      $.export("$summary", `Successfully created task with ID ${response.id}`);
    }
    return response;
  },
};
