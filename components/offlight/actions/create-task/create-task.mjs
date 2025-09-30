import offlight from "../../offlight.app.mjs";

export default {
  key: "offlight-create-task",
  name: "Create Task",
  description: "Initiates the creation of a new task in Offlight. [See the documentation](https://www.offlight.work/docs/zapeir-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    offlight,
    taskName: {
      type: "string",
      label: "Task Name",
      description: "The name of the task.",
    },
    taskNote: {
      type: "string",
      label: "Task Note",
      description: "A note about the task.",
      optional: true,
    },
    taskDeadline: {
      type: "string",
      label: "Task Deadline",
      description: "The deadline of the task. **In ISO 8601 format (YYYY-MM-DD)**.",
      optional: true,
    },
    identifier: {
      type: "string",
      label: "Identifier",
      description: "A unique identifier for the task.",
      optional: true,
    },
    sourceName: {
      type: "string",
      label: "Source Name",
      description: "The source name of the task.",
      optional: true,
    },
    sourceLink: {
      type: "string",
      label: "Source Link",
      description: "The source link of the task.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.offlight.createTask({
      $,
      data: {
        task_name: this.taskName,
        task_note: this.taskNote,
        task_deadline: this.taskDeadline,
        identifier: this.identifier,
        source_name: this.sourceName,
        source_link: this.sourceLink,
      },
    });

    $.export("$summary", `Task successfully created with ID: ${response.id}`);
    return response;
  },
};
