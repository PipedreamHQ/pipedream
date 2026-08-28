import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-post-analytics",
  name: "Post Analytics",
  description: "Get aggregated post analytics (status counts and media usage). [See the documentation](https://contentrabbitai.com/docs/api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    contentRabbitApp,
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
    const response = await this.contentRabbitApp.getPostAnalytics({
      $,
      params: {
        start: this.start,
        end: this.end,
        timezone: this.timezone,
      },
    });
    $.export("$summary", "Retrieved post analytics");
    return response;
  },
};
