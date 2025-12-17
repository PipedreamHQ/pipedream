import microsoftTodo from "../../microsofttodo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "microsofttodo-create-task",
  name: "Create Task",
  description: "Create a new task in Microsoft To Do. [See the documentation](https://learn.microsoft.com/en-us/graph/api/todotasklist-post-tasks).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    title: {
      propDefinition: [
        microsoftTodo,
        "title",
      ],
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
    if (!this.timeZone && (this.dueDateTime || this.reminderDateTime)) {
      throw new ConfigurationError("Time Zone must be specified for Due Date and/or Reminder Date.");
    }

    const data = {
      title: this.title,
      isReminderOn: this.isReminderOn,
      importance: this.importance,
    };

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

    const response = await this.microsoftTodo.createTask({
      taskListId: this.taskListId,
      data,
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully created task with ID ${response.id}.`);
    }

    return response;
  },
};
