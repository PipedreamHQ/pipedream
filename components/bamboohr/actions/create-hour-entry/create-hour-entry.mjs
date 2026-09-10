import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-create-hour-entry",
  name: "Create Hour Entry",
  description: "Create a time-tracking hour entry (POST /time-tracking/hour-entries). Records worked hours for an employee on a date. [See the documentation](https://documentation.bamboohr.com/reference/create-hour-entry)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    bamboohr,
    employeeId: {
      propDefinition: [
        bamboohr,
        "employeeId",
      ],
    },
    date: {
      type: "string",
      label: "Date",
      description: "Date in YYYY-MM-DD format, e.g. `2026-09-01`.",
    },
    hours: {
      type: "string",
      label: "Hours",
      description: "Number of hours worked as a decimal; must be greater than 0, e.g. `8` or `7.5`.",
    },
    note: {
      type: "string",
      label: "Note",
      description: "Optional note.",
      optional: true,
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "Optional numeric project ID, e.g. `19`. Find valid IDs in your BambooHR time tracking project settings.",
      optional: true,
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "Optional numeric task ID within the project, e.g. `47`. Find valid IDs in your BambooHR time tracking project settings.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.createHourEntry({
      $,
      data: {
        employeeId: parseInt(this.employeeId, 10),
        date: this.date,
        hours: parseFloat(this.hours),
        note: this.note,
        projectId: this.projectId,
        taskId: this.taskId,
      },
    });
    $.export("$summary", `Created hour entry for employee ${this.employeeId} on ${this.date}`);
    return response;
  },
};
