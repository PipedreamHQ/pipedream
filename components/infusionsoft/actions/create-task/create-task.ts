import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import { CreateTaskParams } from "../../types/requestParams";

export default defineAction({
  name: "Create Task",
  description:
    "Create a new task in Keap CRM. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Task/operation/createTask)",
  key: "infusionsoft-create-task",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    infusionsoft,
    assignedToUserId: {
      type: "string",
      label: "Assigned To User ID",
      description: "The ID of the Keap user the task is assigned to",
      optional: false,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the task",
      optional: true,
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact associated with this task",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A detailed description of the task",
      optional: true,
    },
    dueTime: {
      type: "string",
      label: "Due Time",
      description: "The due date/time for the task in ISO 8601 format",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority level of the task",
      optional: true,
      options: [
        {
          label: "Critical",
          value: "CRITICAL",
        },
        {
          label: "Essential",
          value: "ESSENTIAL",
        },
        {
          label: "Non-Essential",
          value: "NONESSENTIAL",
        },
      ],
    },
    type: {
      type: "string",
      label: "Task Type",
      description: "The type of task (e.g., Call, Email, Appointment)",
      optional: true,
    },
    completed: {
      type: "boolean",
      label: "Completed",
      description: "Whether the task is already completed",
      optional: true,
      default: false,
    },
    completionTime: {
      type: "string",
      label: "Completion Time",
      description: "The completion date/time in ISO 8601 format (if completed)",
      optional: true,
    },
    remindTimeMins: {
      type: "string",
      label: "Reminder Time (Minutes)",
      description: "Minutes before the task due time to show a reminder",
      optional: true,
      options: [
        {
          label: "5 minutes",
          value: "5",
        },
        {
          label: "10 minutes",
          value: "10",
        },
        {
          label: "15 minutes",
          value: "15",
        },
        {
          label: "30 minutes",
          value: "30",
        },
        {
          label: "1 hour",
          value: "60",
        },
        {
          label: "2 hours",
          value: "120",
        },
        {
          label: "4 hours",
          value: "240",
        },
        {
          label: "8 hours",
          value: "480",
        },
        {
          label: "1 day",
          value: "1440",
        },
        {
          label: "2 days",
          value: "2880",
        },
      ],
    },
  },
  async run({ $ }): Promise<object> {
    if (this.completionTime?.trim() && this.completed !== true) {
      throw new Error("completionTime is only allowed when completed is true");
    }

    const params: CreateTaskParams = {
      $,
      assignedToUserId: this.assignedToUserId,
      title: this.title,
      contactId: this.contactId,
      description: this.description,
      dueTime: this.dueTime,
      priority: this.priority,
      type: this.type,
      completed: this.completed,
      completionTime: this.completionTime,
      remindTimeMins: this.remindTimeMins,
    };

    const result = await this.infusionsoft.createTask(params);

    $.export(
      "$summary",
      `Successfully created task${this.title
        ? ` "${this.title}"`
        : ""}`,
    );

    return result;
  },
});
