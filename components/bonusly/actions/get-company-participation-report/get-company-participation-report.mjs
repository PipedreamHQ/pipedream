// x-pd-ai: optimized
import bonusly from "../../bonusly.app.mjs";

export default {
  key: "bonusly-get-company-participation-report",
  name: "Get Company Participation Report",
  description:
    "Return company-level recognition participation analytics — giving/receiving"
    + " rates by group (department, location, etc.) or by manager and team,"
    + " for a given date range."
    + " [See the documentation](https://docs.bonus.ly/reference/adminparticipationreport-1)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    bonusly,
    reportView: {
      type: "string",
      label: "Report View",
      description: "Which participation view to return.",
      options: [
        "giving_and_receiving",
        "managers_and_teams",
      ],
    },
    startDate: {
      propDefinition: [
        bonusly,
        "startDate",
      ],
      description: "Start of the report's date range, in `YYYY-MM-DD` format, e.g. `2026-01-01`.",
      optional: false,
    },
    endDate: {
      propDefinition: [
        bonusly,
        "endDate",
      ],
      description: "End of the report's date range, in `YYYY-MM-DD` format, e.g. `2026-06-30`."
        + " Bonusly cannot report on the current or an ongoing month, so this must be no later than"
        + " the last day of the previous month — for example, any time during August 2026 the latest"
        + " valid value is `2026-07-31`. A later date is rejected.",
      optional: false,
    },
    customPropertyGroup: {
      type: "string",
      label: "Custom Property Group",
      description: "Grouping dimension to break the `giving_and_receiving` view down by, e.g. `department` or `location`. Ignored for the `managers_and_teams` view.",
      optional: true,
    },
    includeTrend: {
      type: "boolean",
      label: "Include Trend",
      description: "Set to `true` to include trend data alongside the current period's metrics.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bonusly.getAdminParticipationReport({
      $,
      reportView: this.reportView,
      startDate: this.startDate,
      endDate: this.endDate,
      customPropertyGroup: this.customPropertyGroup,
      includeTrend: this.includeTrend,
    });

    $.export("$summary", `Retrieved ${this.reportView} participation report for ${this.startDate} to ${this.endDate}`);
    return response;
  },
};
