import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-create-clock-entry",
  name: "Create Clock Entry",
  description: "Create a manual/retroactive clock entry with explicit start and end (POST /time-tracking/clock-entries). For real-time punches use **Clock In** / **Clock Out** instead. [See the documentation](https://documentation.bamboohr.com/reference/create-clock-entry)",
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
    start: {
      type: "string",
      label: "Start",
      description: "ISO 8601 datetime for clock-in, e.g. `2026-09-10T09:00:00-05:00`.",
    },
    end: {
      type: "string",
      label: "End",
      description: "ISO 8601 datetime for clock-out; must be after start.",
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "IANA timezone string, e.g. `America/Chicago`.",
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
      description: "Optional project ID.",
      optional: true,
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "Optional task ID (requires projectId).",
      optional: true,
    },
    clockInLocation: {
      type: "string",
      label: "Clock In Location",
      description: "Optional clock-in location.",
      optional: true,
    },
    clockOutLocation: {
      type: "string",
      label: "Clock Out Location",
      description: "Optional clock-out location.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.createClockEntry({
      $,
      data: {
        employeeId: parseInt(this.employeeId, 10),
        start: this.start,
        end: this.end,
        timezone: this.timezone,
        note: this.note,
        projectId: this.projectId,
        taskId: this.taskId,
        clockInLocation: this.clockInLocation,
        clockOutLocation: this.clockOutLocation,
      },
    });
    $.export("$summary", `Created clock entry for employee ${this.employeeId}`);
    return response;
  },
};
