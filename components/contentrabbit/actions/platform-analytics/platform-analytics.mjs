import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-platform-analytics",
  name: "Platform Analytics",
  description: "Get per-platform publish metrics for a date range. [See the documentation](https://contentrabbitai.com/docs/api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    contentRabbitApp,
    platforms: {
      type: "string[]",
      label: "Platforms",
      description: "Filter by platform (e.g. `twitter`, `linkedin`).",
      optional: true,
    },
    start: {
      type: "string",
      label: "Start Date",
      description: "ISO 8601 start of the range. Defaults to 30 days before end date. A UTC timestamp with a `Z` suffix (e.g. `2026-08-01T00:00:00Z`) is always accepted.",
      optional: true,
    },
    end: {
      type: "string",
      label: "End Date",
      description: "ISO 8601 end of the range. Defaults to now. A UTC timestamp with a `Z` suffix (e.g. `2026-08-31T23:59:59Z`) is always accepted.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "IANA timezone (e.g. `America/New_York`). Defaults to team timezone.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.contentRabbitApp.getPlatformAnalytics({
      $,
      params: {
        platform: this.platforms,
        start: this.start,
        end: this.end,
        timezone: this.timezone,
      },
    });
    $.export("$summary", "Retrieved platform analytics");
    return response;
  },
};
