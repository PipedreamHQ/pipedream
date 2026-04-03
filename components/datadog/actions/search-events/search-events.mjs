import datadog from "../../datadog.app.mjs";

export default {
  key: "datadog-search-events",
  name: "Search Events",
  description:
    "Search Datadog events such as monitor alerts,"
    + " deployment notifications, and infrastructure changes."
    + " [See the docs](https://docs.datadoghq.com/api/latest/"
    + "events/#get-a-list-of-events)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    datadog,
    region: {
      propDefinition: [
        datadog,
        "region",
      ],
    },
    start: {
      type: "integer",
      label: "Start",
      description:
        "POSIX timestamp (seconds) for the start of the query window."
        + " Defaults to 24 hours ago.",
      optional: true,
    },
    end: {
      type: "integer",
      label: "End",
      description:
        "POSIX timestamp (seconds) for the end of the query window."
        + " Defaults to now.",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "Filter by event priority.",
      optional: true,
      options: [
        "normal",
        "low",
      ],
    },
    sources: {
      type: "string",
      label: "Sources",
      description:
        "Comma-separated list of sources to filter events."
        + " E.g. `nagios,hudson`.",
      optional: true,
    },
    tags: {
      type: "string",
      label: "Tags",
      description:
        "Comma-separated list of tags to filter events."
        + " E.g. `env:prod,role:db`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const now = Math.floor(Date.now() / 1000);
    const params = {
      start: this.start ?? (now - 86400),
      end: this.end ?? now,
    };
    if (this.priority) params.priority = this.priority;
    if (this.sources) params.sources = this.sources;
    if (this.tags) params.tags = this.tags;

    const response = await this.datadog.getEvents({
      $,
      params,
      region: this.region,
    });

    const count = response?.events?.length ?? 0;
    $.export(
      "$summary",
      `Found ${count} event${count === 1
        ? ""
        : "s"}`,
    );

    return response;
  },
};
