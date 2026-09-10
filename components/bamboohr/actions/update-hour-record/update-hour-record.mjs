import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-update-hour-record",
  name: "Update Hour Record",
  description: "Edit an existing legacy Hours API record's hours worked and links (PUT /timetracking/adjust). Send the corrected total hours worked, not a delta. Use **Get Time Tracking Record** to check current values first. [See the documentation](https://documentation.bamboohr.com/reference/update-time-tracking-record)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    bamboohr,
    recordId: {
      propDefinition: [
        bamboohr,
        "recordId",
      ],
      description: "The ID of the hour record to update. Run **Get Time Tracking Record** to check its current values, or use the ID you supplied in **Create Hour Record**.",
    },
    hoursWorked: {
      type: "string",
      label: "Hours Worked",
      description: "The corrected total number of hours worked (not a delta) — e.g. send `6.0` if the employee actually worked 6 hours instead of the original 8.",
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "Optional project ID to associate with the record.",
      optional: true,
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "Optional task ID to associate with the record.",
      optional: true,
    },
    shiftDifferentialId: {
      type: "string",
      label: "Shift Differential ID",
      description: "Optional shift differential ID to associate with the record.",
      optional: true,
    },
    holidayId: {
      type: "string",
      label: "Holiday ID",
      description: "Optional holiday ID to associate with the record.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.updateHourRecord({
      $,
      data: {
        timeTrackingId: this.recordId,
        hoursWorked: parseFloat(this.hoursWorked),
        projectId: this.projectId
          ? parseInt(this.projectId, 10)
          : undefined,
        taskId: this.taskId
          ? parseInt(this.taskId, 10)
          : undefined,
        shiftDifferentialId: this.shiftDifferentialId
          ? parseInt(this.shiftDifferentialId, 10)
          : undefined,
        holidayId: this.holidayId
          ? parseInt(this.holidayId, 10)
          : undefined,
      },
    });
    $.export("$summary", `Updated hour record ${this.recordId}`);
    return response;
  },
};
