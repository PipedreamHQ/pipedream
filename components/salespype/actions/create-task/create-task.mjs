import salespype from "../../salespype.app.mjs";

export default {
  key: "salespype-create-task",
  name: "Create Task",
  description: "Creates a new task in Salespype. [See the documentation](https://documenter.getpostman.com/view/5101444/2s93Y3u1Eb#a9c6449a-b844-465c-a342-deea01e52c3f)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      type: "string",
      label: "Task",
      description: "The task description",
    },
    taskTypeId: {
      propDefinition: [
        salespype,
        "taskTypeId",
      ],
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date for the task. E.g. `2021-02-20`",
    },
    time: {
      type: "string",
      label: "Time",
      description: "The time for the task. E.g. `34:00:34`",
    },
    duration: {
      type: "string",
      label: "Duration",
      description: "The duration of the task. E.g. `34:00:34`",
    },
    note: {
      type: "string",
      label: "Note",
      description: "Additional notes for the task",
    },
  },
  async run({ $ }) {
    const {
      task, message,
    } = await this.salespype.createTask({
      $,
      contactId: this.contactId,
      data: {
        task: this.task,
        taskTypeId: this.taskTypeId,
        date: this.date,
        time: this.time,
        duration: this.duration,
        note: this.note,
      },
    });

    if (message) {
      throw new Error(`${message}`);
    }

    $.export("$summary", `Created task '${this.task}' with ID ${task.id}`);
    return task;
  },
};
