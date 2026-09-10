import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-clock-in",
  name: "Clock In",
  description: "Clock an employee in in real time (POST /time_tracking/employees/{employeeId}/clock_in). This is a separate endpoint from **Clock Out**. For manual/retroactive entries use **Create Clock Entry**. [See the documentation](https://documentation.bamboohr.com/reference/create-timesheet-clock-in-entry)",
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
      description: "Date in YYYY-MM-DD format (defaults to today).",
      optional: true,
    },
    start: {
      type: "string",
      label: "Start Time",
      description: "Start time in 24h HH:MM format.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "IANA timezone string, e.g. `America/Chicago`.",
      optional: true,
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "Optional project ID.",
      optional: true,
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "Optional task ID (requires projectId).",
      optional: true,
    },
    breakId: {
      type: "string",
      label: "Break ID",
      description: "Optional break ID.",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Optional note.",
      optional: true,
    },
    offline: {
      type: "boolean",
      label: "Offline",
      description: "Whether the punch was captured offline.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.clockIn({
      $,
      employeeId: this.employeeId,
      data: {
        date: this.date,
        start: this.start,
        timezone: this.timezone,
        projectId: this.projectId,
        taskId: this.taskId,
        breakId: this.breakId,
        note: this.note,
        offline: this.offline,
      },
    });
    $.export("$summary", `Clocked in employee ${this.employeeId}`);
    return response;
  },
};
