import { ConfigurationError } from "@pipedream/platform";
import donethat from "../../donethat.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "donethat-get-time-report",
  name: "Get Time Report",
  description: "Get the time DoneThat tracked over a date range, as rows aggregated by day, week, task or activity."
    + " Use it for timesheets and \"how much time went where\" questions; use **Get Summary** for a written recap instead."
    + " Day rows include total `duration` in minutes plus per-project and per-category minutes; task and activity rows include titles and descriptions."
    + " Dates are UTC calendar days. Activity resolution covers up to 90 days, the other levels up to 365 days; week aggregation drops partial weeks at the edges of the range."
    + " [See the documentation](https://donethat.ai/api-reference/reports)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    donethat,
    startDate: {
      type: "string",
      label: "Start Date",
      description: "First day of the report (inclusive), as `YYYY-MM-DD` in UTC, e.g. `2026-01-01`.",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "Last day of the report (inclusive), as `YYYY-MM-DD` in UTC, e.g. `2026-01-31`.",
    },
    aggregationLevel: {
      type: "string",
      label: "Aggregation Level",
      description: "How rows are grouped. One of `day`, `week`, `task` or `activity` (one row per tracked minute), e.g. `day`.",
      options: constants.AGGREGATION_LEVELS,
      default: "day",
    },
    projectIds: {
      propDefinition: [
        donethat,
        "projectIds",
      ],
    },
    teamIds: {
      type: "string[]",
      label: "Team IDs",
      description: "Report on the activity of these teams' members instead of only your own, e.g. `[\"team_123\"]`."
        + " You must be an active member of each team. Not available with the `activity` aggregation level."
        + " Team IDs appear as the `teamId` field in **List Projects**.",
      optional: true,
    },
    includeCategories: {
      type: "boolean",
      label: "Include Categories",
      description: "Whether rows include per-category minutes, e.g. `true`. Defaults to `true`.",
      optional: true,
    },
    includeProjects: {
      type: "boolean",
      label: "Include Projects",
      description: "Whether rows include per-project minutes, e.g. `true`. Defaults to `true`.",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Row order. One of `desc` (newest first) or `asc` (oldest first), e.g. `desc`. When omitted, rows are ordered by their stable row ID.",
      options: constants.SORT_ORDERS,
      optional: true,
    },
  },
  async run({ $ }) {
    const from = utils.dateToUtcStartMs(this.startDate, "Start Date");
    const to = utils.dateToUtcEndExclusiveMs(this.endDate, "End Date");
    if (to <= from) {
      throw new ConfigurationError("End Date must be on or after Start Date.");
    }
    if (this.teamIds?.length && this.aggregationLevel === "activity") {
      throw new ConfigurationError("Team IDs only work with the `day`, `week` or `task` aggregation level.");
    }

    const response = await this.donethat.getReport({
      $,
      data: {
        dateRange: {
          from,
          to,
        },
        aggregationLevel: this.aggregationLevel,
        projectIds: this.projectIds?.length
          ? this.projectIds
          : undefined,
        teamIds: this.teamIds?.length
          ? this.teamIds
          : undefined,
        includeCategories: this.includeCategories,
        includeProjects: this.includeProjects,
        sort: this.sort,
      },
    });

    const rowCount = response.rowCount ?? response.rows?.length ?? 0;
    $.export("$summary", `Retrieved ${rowCount} ${this.aggregationLevel} row${rowCount === 1
      ? ""
      : "s"} from ${this.startDate} to ${this.endDate}`);
    return response;
  },
};
