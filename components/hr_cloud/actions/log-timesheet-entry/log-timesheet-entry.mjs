import hrCloud from "../../hr_cloud.app.mjs";

export default {
  key: "hr_cloud-log-timesheet-entry",
  name: "Log Timesheet Entry",
  description: "Log a new timesheet entry for an employee. [See the documentation](https://help.hrcloud.com/api/#/introduction#top)",
  version: "0.0.1",
  type: "action",
  props: {
    hrCloud,
    employeeId: {
      propDefinition: [
        hrCloud,
        "employeeId",
      ],
    },
    hours: {
      propDefinition: [
        hrCloud,
        "hours",
      ],
    },
    date: {
      propDefinition: [
        hrCloud,
        "date",
      ],
    },
    projectId: {
      propDefinition: [
        hrCloud,
        "projectId",
      ],
    },
    notes: {
      propDefinition: [
        hrCloud,
        "notes",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hrCloud.createTimesheetEntry({
      $,
      data: {
        employee_id: this.employeeId,
        hours: this.hours,
        date: this.date,
        project_id: this.projectId,
        notes: this.notes,
      },
    });

    const employee = await this.hrCloud.getEmployee(this.employeeId, {
      $,
    });
    const employeeName = `${employee.first_name} ${employee.last_name}`;

    $.export("$summary", `Successfully logged ${this.hours} hours for ${employeeName}`);
    return response;
  },
};
