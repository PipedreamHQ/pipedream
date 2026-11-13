import taskade from "../../taskade.app.mjs";

export default {
  key: "taskade-set-task-due-date",
  name: "Set Task Due Date",
  description: "Sets or replaces the date of a task in a Taskade project."
    + " Give only a start date for a single due date, or add an end date for a date range."
    + " Use **List Tasks** to find the task ID."
    + " [See the documentation](https://docs.taskade.com/developers/comprehensive-api-guide/tasks/update-task-date)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    taskade,
    projectId: {
      propDefinition: [
        taskade,
        "projectId",
      ],
    },
    taskId: {
      propDefinition: [
        taskade,
        "taskId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The due date, or the start of the date range, in `YYYY-MM-DD` format, e.g. `2026-12-31`.",
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The time on the start date in 24-hour `HH:MM:SS` format, e.g. `15:30:00`. Leave it out for an all-day date.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end of the date range in `YYYY-MM-DD` format, e.g. `2027-01-07`. Leave it out for a single due date.",
      optional: true,
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The time on the end date in 24-hour `HH:MM:SS` format, e.g. `17:00:00`. Used only with `endDate`.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The IANA timezone name for the times, e.g. `America/New_York`. Leave it out for a date without a timezone.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.taskade.createOrUpdateDueDate({
      $,
      projectId: this.projectId,
      taskId: this.taskId,
      data: {
        start: {
          date: this.startDate,
          time: this.startTime,
          timezone: this.timezone,
        },
        end: this.endDate
          ? {
            date: this.endDate,
            time: this.endTime,
            timezone: this.timezone,
          }
          : undefined,
      },
    });
    $.export("$summary", `Successfully set the date of task with ID ${this.taskId} to ${this.startDate}${this.endDate
      ? ` - ${this.endDate}`
      : ""}`);
    return response;
  },
};
