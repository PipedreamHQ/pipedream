import app from "../../recruitee.app.mjs";
import timezones from "../common/timezones.mjs";

export default {
  name: "Create Task",
  description: "Create a new task for a candidate. [See the documentation](https://api.recruitee.com/docs/index.html#task.web.task-task.web.task-post)",
  key: "recruitee-create-task",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    title: {
      type: "string",
      label: "Title",
      description: "The task title",
    },
    candidateId: {
      propDefinition: [
        app,
        "candidateId",
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "The task description",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The task due date. format as [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) e.g. `2023-11-15T08:30:00Z`",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The task timezone",
      optional: true,
      options: timezones,
    },
  },
  async run({ $ }) {
    const payload = {
      candidate_id: this.candidateId,
      description: this.description,
      due_date: this.dueDate,
      timezone: this.timezone,
      title: this.title,
    };
    const response = await this.app.createTask({
      $,
      data: {
        task: payload,
      },
    });
    $.export("$summary", `Successfully created task with ID \`${response.task.id}\``);
    return response;
  },
};
