import bamboohr from "../../bamboohr.app.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "bamboohr-create-time-off-request",
  name: "Create Time Off Request",
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
      description: "Required unless `dates` is supplied instead. Total amount of time off for the whole date range, **measured in the time off type's own unit** — run **List Time Off Types** to check whether this type is `days` or `hours` before choosing a value. For a `days` type this is a day-fraction (e.g. `1` for one full day, `3` for a 3-day range), NOT hours; for an `hours` type it's the literal hour count (e.g. `8`). A value outside what the date range can hold (e.g. `8` for a 1-day `days`-type request) is rejected by the API.",
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
      description: "Optional per-day breakdown; when supplied, `amount` is ignored and the sum of these daily amounts is used instead. JSON array of per-day objects, each amount in the time off type's own unit (a `days`-type request typically uses `1` per full day, not hours) — e.g. `[{\"ymd\":\"2026-07-01\",\"amount\":1}]` for a days-type, or `[{\"ymd\":\"2026-07-01\",\"amount\":8}]` for an hours-type.",
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
        throw new ConfigurationError(`${label} must be valid JSON.`);
      }
    };
    const notes = parseJson(this.notes, "Notes");
    const dates = parseJson(this.dates, "Dates");
    if (dates !== undefined && (!Array.isArray(dates) || dates.length === 0)) {
      throw new ConfigurationError("Dates must be a non-empty JSON array.");
    }
    let amount;
    if (this.amount) {
      amount = Number(this.amount);
      if (!Number.isFinite(amount)) {
        throw new ConfigurationError(`Amount must be a valid number, got \`${this.amount}\``);
      }
    }
    if (dates === undefined && amount === undefined) {
      throw new ConfigurationError("Provide Amount or Dates.");
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
