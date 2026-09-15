import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-list-whos-out",
  name: "List Who's Out",
  description: "List a date-sorted feed of employees who are out and company holidays for a period (GET /time_off/whos_out). Returns 403 if the Who's Out feature is disabled for the account. [See the documentation](https://documentation.bamboohr.com/reference/list-whos-out)",
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
    start: {
      type: "string",
      label: "Start",
      description: "Start date in YYYY-MM-DD format (defaults to today).",
      optional: true,
    },
    end: {
      type: "string",
      label: "End",
      description: "End date in YYYY-MM-DD format (defaults to 14 days after start).",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Set to `off` to bypass saved filters for employee time off. Does not affect holiday filtering.",
      optional: true,
      options: [
        "off",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.listWhosOut({
      $,
      params: {
        start: this.start,
        end: this.end,
        filter: this.filter,
      },
    });
    const entries = Array.isArray(response)
      ? response
      : [];
    $.export("$summary", `Found ${entries.length} entr${entries.length === 1
      ? "y"
      : "ies"} who's out`);
    return response;
  },
};
