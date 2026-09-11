import bamboohr from "../../bamboohr.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

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
      description: "The ID of the hour record to update, e.g. `550e8400-e29b-41d4-a716-446655440000` (the UUID you supplied in **Create Hour Record**). Run **Get Time Tracking Record** to check its current values, or use the ID you supplied in **Create Hour Record**.",
    },
    hoursWorked: {
      type: "string",
      label: "Hours Worked",
      description: "The corrected total number of hours worked (not a delta) — e.g. send `6.0` if the employee actually worked 6 hours instead of the original 8.",
    },
    projectId: {
      propDefinition: [
        bamboohr,
        "projectId",
      ],
    },
    taskId: {
      propDefinition: [
        bamboohr,
        "taskId",
      ],
    },
    shiftDifferentialId: {
      type: "string",
      label: "Shift Differential ID",
      description: "Optional numeric shift differential ID to associate with the record, e.g. `1`. Company-specific; find valid IDs in your BambooHR payroll/company settings.",
      optional: true,
    },
    holidayId: {
      type: "string",
      label: "Holiday ID",
      description: "Optional numeric holiday ID to associate with the record, e.g. `1`. Company-specific (legacy Hours API); find valid IDs in your BambooHR payroll/company settings.",
      optional: true,
    },
  },
  async run({ $ }) {
    const hoursWorked = parseFloat(this.hoursWorked);
    if (!Number.isFinite(hoursWorked)) {
      throw new ConfigurationError(`Hours Worked must be a number, got \`${this.hoursWorked}\``);
    }
    const response = await this.bamboohr.updateHourRecord({
      $,
      data: {
        timeTrackingId: this.recordId,
        hoursWorked,
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
