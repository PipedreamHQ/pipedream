import harvest from "../../harvest.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "harvest-get-time-report",
  name: "Get Time Report",
  description: `Retrieve total hours logged, aggregated by a chosen dimension (clients, projects, tasks, or team) over a date range, automatically following pagination up to ${constants.MAX_AUTO_PAGINATE_RECORDS} results. Use when the user asks "how many hours were logged/worked on X", "how much time did the team spend on Y", or wants a time report/summary/breakdown — this is the only tool that returns aggregated totals; **List Time Entries** returns individual raw entries you would have to sum yourself. The Report By value selects which \`/reports/time/{dimension}\` endpoint is called. Example: call with reportBy="projects", from="20260901", to="20260930" to see total hours logged per project for the month. [See the documentation](https://help.getharvest.com/api-v2/reports-api/reports/time-reports/).`,
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    harvest,
    accountId: {
      propDefinition: [
        harvest,
        "accountId",
      ],
    },
    reportBy: {
      type: "string",
      label: "Report By",
      description: "The dimension to group the report by. One of: `clients`, `projects`, `tasks`, `team`.",
      options: constants.REPORT_BY_OPTIONS,
    },
    from: {
      type: "string",
      label: "From",
      description: "Start of the report range, format `YYYYMMDD`, e.g. `20260901`.",
    },
    to: {
      type: "string",
      label: "To",
      description: "End of the report range, format `YYYYMMDD`, e.g. `20260910`.",
    },
    includeFixedFee: {
      type: "boolean",
      label: "Include Fixed Fee",
      description: "Whether to include fixed-fee projects in the report.",
      optional: true,
    },
    includeForecast: {
      type: "boolean",
      label: "Include Forecast",
      description: "Whether to include forecast data (only supported when Report By is `projects` or `team`).",
      optional: true,
    },
  },
  async run({ $ }) {
    const results = [];
    let page = 1;
    do {
      const response = await this.harvest.getTimeReport({
        $,
        reportBy: this.reportBy,
        accountId: this.accountId,
        from: this.from,
        to: this.to,
        include_fixed_fee: this.includeFixedFee,
        include_forecast: this.includeForecast,
        per_page: constants.PAGE_SIZE,
        page,
      });
      if (!response.results?.length) break;
      results.push(...response.results);
      if (!response.next_page || results.length >= constants.MAX_AUTO_PAGINATE_RECORDS) break;
      page += 1;
    } while (true);
    const count = results.length;
    $.export("$summary", `Successfully retrieved time report by ${this.reportBy} with ${count} result${count === 1
      ? ""
      : "s"}`);
    return results;
  },
};
