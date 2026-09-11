import bamboohr from "../../bamboohr.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "bamboohr-adjust-time-off-balance",
  name: "Adjust Time Off Balance",
  description: "Create a balance adjustment for an employee's time off type, recorded as an override history item (PUT /employees/{employeeId}/time_off/balance_adjustment). Cannot adjust discretionary (unlimited) time off types. Use **Get Time Off Balance** to check current balances and **List Time Off Types** for a valid type ID first. [See the documentation](https://documentation.bamboohr.com/reference/adjust-time-off-balance)",
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
      description: "The employee whose balance to adjust, e.g. `100`. Run **Get Employees Directory** to discover IDs.",
    },
    timeOffTypeId: {
      propDefinition: [
        bamboohr,
        "timeOffTypeId",
      ],
      description: "The time off type to adjust the balance for, e.g. `5`. Run **List Time Off Types** to discover IDs; discretionary types cannot be adjusted.",
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date the adjustment should be recorded in history, in YYYY-MM-DD format, e.g. `2026-01-15`.",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The number of hours/days to adjust the balance by. Use a negative number to subtract, e.g. `8` or `-4`.",
    },
    note: {
      type: "string",
      label: "Note",
      description: "Optional note to show in the balance history.",
      optional: true,
    },
  },
  async run({ $ }) {
    const timeOffTypeId = Number(this.timeOffTypeId);
    if (!Number.isInteger(timeOffTypeId)) {
      throw new ConfigurationError(`Time Off Type ID must be an integer, got \`${this.timeOffTypeId}\``);
    }
    const amount = Number(this.amount);
    if (!Number.isFinite(amount)) {
      throw new ConfigurationError(`Amount must be a valid number, got \`${this.amount}\``);
    }
    const response = await this.bamboohr.adjustTimeOffBalance({
      $,
      employeeId: this.employeeId,
      data: {
        date: this.date,
        timeOffTypeId,
        amount,
        note: this.note,
      },
    });
    $.export("$summary", `Adjusted time off balance for employee ${this.employeeId} by ${this.amount}`);
    return response;
  },
};
