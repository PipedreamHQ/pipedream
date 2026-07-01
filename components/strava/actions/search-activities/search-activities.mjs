import app from "../../strava.app.mjs";

const DEFAULT_MAX_ITEMS = 200;

export default {
  key: "strava-search-activities",
  name: "Search Activities",
  description: "Search and list the authenticated athlete's Strava activities, ordered most-recent first."
    + " Use the `before` and `after` epoch parameters to scope a time window. Set `after` to fetch only activities since a known timestamp (efficient delta sync)."
    + " For real-time activity notifications, prefer the Activity Created, Activity Updated, or Activity Deleted webhook sources over polling this tool."
    + " Cross-references: use **Get Activity** to fetch a single activity's full details, **Get Activity Laps** for lap breakdowns, **Get Activity Comments** for comments, **Get Activity Kudoers** for kudos."
    + " Strava read rate limits: 600 / 15 min and 30,000 / day per application. Large unfiltered fetches consume quota — prefer `after` for incremental work."
    + " [See the documentation](https://developers.strava.com/docs/reference/#api-Activities-getLoggedInAthleteActivities)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    before: {
      type: "integer",
      label: "Before (epoch seconds)",
      description: "Filter to activities that took place before this epoch timestamp (seconds, not milliseconds). Example: `1704067200` is 2024-01-01T00:00:00Z.",
      optional: true,
    },
    after: {
      type: "integer",
      label: "After (epoch seconds)",
      description: "Filter to activities that took place after this epoch timestamp (seconds, not milliseconds). Example: `1704067200` is 2024-01-01T00:00:00Z. Use for incremental / delta sync.",
      optional: true,
    },
    maxItems: {
      type: "integer",
      label: "Max activities to return",
      description: `Maximum number of activities to return. Defaults to ${DEFAULT_MAX_ITEMS}. Raise only when you genuinely need every activity — large fetches consume rate limit.`,
      optional: true,
      default: DEFAULT_MAX_ITEMS,
    },
  },
  async run({ $ }) {
    const activities = [];
    const stream = await this.app.getResourcesStream({
      resourceFn: this.app.listActivities,
      resourceFnArgs: {
        $,
        params: {
          before: this.before,
          after: this.after,
          per_page: 100,
        },
      },
      maxItems: this.maxItems ?? DEFAULT_MAX_ITEMS,
    });
    for await (const activity of stream) {
      activities.push(activity);
    }
    $.export(
      "$summary",
      `Found ${activities.length} activit${activities.length === 1
        ? "y"
        : "ies"}`,
    );
    return activities;
  },
};
