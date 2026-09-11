import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-get-time-off-balance",
  name: "Get Time Off Balance",
  description: "Get time off balances for an employee as of a date (GET /employees/{employeeId}/time_off/calculator). Returns one entry per assigned policy. Run **Get Employees Directory** to find the employee ID. [See the documentation](https://documentation.bamboohr.com/reference/get-time-off-balance)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  ai: "optimized",
  props: {
    bamboohr,
    employeeId: {
      propDefinition: [
        bamboohr,
        "employeeId",
      ],
      description: "The employee ID (digits only; `0` is not accepted), e.g. `12345`. Run **Get Employees Directory** to discover IDs.",
    },
    end: {
      type: "string",
      label: "End Date",
      description: "As-of date in YYYY-MM-DD format (defaults to today), e.g. `2026-12-31`.",
      optional: true,
    },
    precision: {
      type: "integer",
      label: "Precision",
      description: "Decimal precision for balances. Min 0, max 4 (default 2).",
      min: 0,
      max: 4,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.getTimeOffBalance({
      $,
      employeeId: this.employeeId,
      params: {
        end: this.end,
        precision: this.precision,
      },
    });
    $.export("$summary", `Retrieved time off balance for employee ${this.employeeId}`);
    return response;
  },
};
