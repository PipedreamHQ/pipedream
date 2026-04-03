import datadog from "../../datadog.app.mjs";

export default {
  key: "datadog-search-monitors",
  name: "Search Monitors",
  description:
    "Search and list Datadog monitors, including statuses,"
    + " thresholds, and alert conditions."
    + " [See the docs](https://docs.datadoghq.com/api/latest/"
    + "monitors/#get-all-monitor-details)",
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
    query: {
      type: "string",
      label: "Query",
      description:
        "Filter monitors by name, tag, or other attributes."
        + " E.g. `tag:env:production` or `type:metric`.",
      optional: true,
    },
    tags: {
      type: "string",
      label: "Tags",
      description:
        "Comma-separated list of tags to filter monitors."
        + " E.g. `env:prod,team:backend`.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to return (0-indexed).",
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description:
        "Number of monitors per page. Default `100`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.query) params.query = this.query;
    if (this.tags) params.tags = this.tags;
    if (this.page !== undefined) params.page = this.page;
    if (this.pageSize !== undefined) params.page_size = this.pageSize;

    const response = await this.datadog.listMonitors({
      $,
      params,
      region: this.region,
    });

    const count = Array.isArray(response)
      ? response.length
      : 0;
    $.export(
      "$summary",
      `Found ${count} monitor${count === 1
        ? ""
        : "s"}`,
    );

    return response;
  },
};
