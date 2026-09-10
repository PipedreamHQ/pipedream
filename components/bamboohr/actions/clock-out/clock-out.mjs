import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-clock-out",
  name: "Clock Out",
  description: "Clock an employee out in real time (POST /time_tracking/employees/{employeeId}/clock_out). Separate endpoint from **Clock In**; returns 409 if the employee is not currently clocked in. [See the documentation](https://documentation.bamboohr.com/reference/create-timesheet-clock-out-entry)",
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
      propDefinition: [
        bamboohr,
        "clockDate",
      ],
    },
    end: {
      type: "string",
      label: "End Time",
      description: "End time in 24h HH:MM format.",
      optional: true,
    },
    timezone: {
      propDefinition: [
        bamboohr,
        "timezone",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.clockOut({
      $,
      employeeId: this.employeeId,
      data: {
        date: this.date,
        end: this.end,
        timezone: this.timezone,
      },
    });
    $.export("$summary", `Clocked out employee ${this.employeeId}`);
    return response;
  },
};
