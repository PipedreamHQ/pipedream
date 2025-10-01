import microsoftTodo from "../../microsofttodo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "microsofttodo-update-task",
  name: "Update Task",
  description: "Updates an existing task in Microsoft To Do. [See the documentation](https://learn.microsoft.com/en-us/graph/api/todotask-update).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    microsoftTodo,
    taskListId: {
      propDefinition: [
        microsoftTodo,
        "taskListId",
      ],
    },
    taskId: {
      propDefinition: [
        microsoftTodo,
        "taskId",
        (c) => ({
          taskListId: c.taskListId,
        }),
      ],
    },
    title: {
      propDefinition: [
        microsoftTodo,
        "title",
      ],
      optional: true,
    },
    dueDateTime: {
      propDefinition: [
        microsoftTodo,
        "dueDateTime",
      ],
    },
    reminderDateTime: {
      propDefinition: [
        microsoftTodo,
        "reminderDateTime",
      ],
    },
    isReminderOn: {
      propDefinition: [
        microsoftTodo,
        "isReminderOn",
      ],
    },
    importance: {
      propDefinition: [
        microsoftTodo,
        "importance",
      ],
    },
    timeZone: {
      propDefinition: [
        microsoftTodo,
        "timeZone",
      ],
    },
  },
  async run({ $ }) {
    if (!this.title
      && !this.dueDateTime
      && !this.reminderDateTime
      && this.isReminderOn === undefined
      && !this.importance
      && !this.timeZone) {
      throw new ConfigurationError("At least one field must be entered.");
    }

    if (!this.timeZone && (this.dueDateTime || this.reminderDateTime)) {
      throw new ConfigurationError("Time Zone must be specified for Due Date and/or Reminder Date.");
    }

    const data = {};

    if (this.title) {
      data.title = this.title;
    }

    if (this.isReminderOn !== undefined) {
      data.isReminderOn = this.isReminderOn;
    }

    if (this.importance) {
      data.importance = this.importance;
    }

    if (this.dueDateTime) {
      data.dueDateTime = {
        dateTime: this.dueDateTime,
        timeZone: this.timeZone,
      };
    }

    if (this.reminderDateTime) {
      data.reminderDateTime = {
        dateTime: this.reminderDateTime,
        timeZone: this.timeZone,
      };
    }

    const response = await this.microsoftTodo.updateTask({
      taskListId: this.taskListId,
      taskId: this.taskId,
      data,
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully updated task with ID ${response.id}.`);
    }

    return response;
  },
};
