import salespype from "../../salespype.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "salespype-create-task",
  name: "Create Task",
  description: "Creates a new task in Salespype. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    salespype,
    contactId: {
      propDefinition: [
        salespype,
        "contactId",
      ],
    },
    task: {
      propDefinition: [
        salespype,
        "task",
      ],
    },
    taskTypeId: {
      propDefinition: [
        salespype,
        "taskTypeId",
      ],
    },
    date: {
      propDefinition: [
        salespype,
        "date",
      ],
      optional: true,
    },
    time: {
      propDefinition: [
        salespype,
        "time",
      ],
      optional: true,
    },
    duration: {
      propDefinition: [
        salespype,
        "duration",
      ],
      optional: true,
    },
    note: {
      propDefinition: [
        salespype,
        "note",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const taskData = {
      contact_id: this.contactId,
      task: this.task,
      task_type_id: this.taskTypeId,
      ...(this.date && {
        date: this.date,
      }),
      ...(this.time && {
        time: this.time,
      }),
      ...(this.duration && {
        duration: this.duration,
      }),
      ...(this.note && {
        note: this.note,
      }),
    };

    const task = await this.salespype.createTask(taskData);

    $.export("$summary", `Created task '${this.task}' with ID ${task.id}`);
    return task;
  },
};
