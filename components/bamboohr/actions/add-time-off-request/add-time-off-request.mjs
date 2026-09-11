import bamboohr from "../../bamboohr.app.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "bamboohr-add-time-off-request",
  name: "Add Time Off Request",
  description: "Create a time off request for an employee (PUT /employees/{employeeId}/time_off/request). Use **List Time Off Types** to find a valid time off type ID and **Get Employees Directory** for the employee ID. [See the documentation](https://documentation.bamboohr.com/reference/create-time-off-request)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  ai: "optimized",
  props: {
    bamboohr,
    employeeId: {
      propDefinition: [
        bamboohr,
        "employeeId",
      ],
      description: "The employee ID (digits only), e.g. `100`. Run **Get Employees Directory** to discover IDs.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Initial request status. One of `approved`, `denied`, `declined`, `requested`.",
      options: constants.TIME_OFF_CREATE_STATUSES,
    },
    start: {
      type: "string",
      label: "Start",
      description: "Start date in YYYY-MM-DD format.",
    },
    end: {
      type: "string",
      label: "End",
      description: "End date in YYYY-MM-DD format.",
    },
    timeOffTypeId: {
      propDefinition: [
        bamboohr,
        "timeOffTypeId",
      ],
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Total amount of time off (number, e.g. `8`).",
      optional: true,
    },
    previousRequest: {
      type: "string",
      label: "Previous Request",
      description: "The ID of a prior time off request to supersede, e.g. `12345`. Run **List Time Off Requests** to find a valid ID. Supersedes the prior request: it's cancelled, its approval workflow is removed, and any related notifications are deleted.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "JSON array of note objects, e.g. `[{\"from\":\"employee\",\"note\":\"Vacation\"}]`.",
      optional: true,
    },
    dates: {
      type: "string",
      label: "Dates",
      description: "JSON array of per-day objects, e.g. `[{\"ymd\":\"2026-07-01\",\"amount\":8}]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const parseJson = (value, label) => {
      if (!value) {
        return undefined;
      }
      try {
        return JSON.parse(value);
      } catch {
        throw new ConfigurationError(`${label} must be valid JSON, got \`${value}\``);
      }
    };
    const notes = parseJson(this.notes, "Notes");
    const dates = parseJson(this.dates, "Dates");
    let amount;
    if (this.amount) {
      amount = Number(this.amount);
      if (!Number.isFinite(amount)) {
        throw new ConfigurationError(`Amount must be a valid number, got \`${this.amount}\``);
      }
    }
    const response = await this.bamboohr.createTimeOffRequest({
      $,
      employeeId: this.employeeId,
      data: {
        status: this.status,
        start: this.start,
        end: this.end,
        timeOffTypeId: this.timeOffTypeId,
        amount,
        previousRequest: this.previousRequest,
        notes,
        dates,
      },
    });
    $.export("$summary", `Created time off request for employee ${this.employeeId}`);
    return response;
  },
};
