import bamboohr from "../../bamboohr.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

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
  },
  async run({ $ }) {
    const hours = Number(this.hours);
    if (!Number.isFinite(hours) || hours <= 0) {
      throw new ConfigurationError(`Hours must be a number greater than 0, got \`${this.hours}\``);
    }
    const toInt = (value, label) => {
      if (!value) {
        return undefined;
      }
      const parsed = Number(value);
      if (!Number.isInteger(parsed)) {
        throw new ConfigurationError(`${label} must be an integer, got \`${value}\``);
      }
      return parsed;
    };
    const response = await this.bamboohr.createHourEntry({
      $,
      data: {
        employeeId: parseInt(this.employeeId, 10),
        date: this.date,
        hours,
        note: this.note,
        projectId: toInt(this.projectId, "Project ID"),
        taskId: toInt(this.taskId, "Task ID"),
      },
    });
    $.export("$summary", `Created hour entry for employee ${this.employeeId} on ${this.date}`);
    return response;
  },
};
