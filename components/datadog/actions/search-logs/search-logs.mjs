import datadog from "../../datadog.app.mjs";

export default {
  key: "datadog-search-logs",
  name: "Search Logs",
  description:
    "Search for logs matching a query, with support for facets"
    + " and time ranges."
    + " [See the docs](https://docs.datadoghq.com/api/latest/"
    + "logs/#search-logs)",
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
        "Search query following"
        + " [log search syntax]"
        + "(https://docs.datadoghq.com/logs/search_syntax/)."
        + " E.g. `service:web-app status:error`",
      default: "*",
    },
    from: {
      type: "string",
      label: "From",
      description:
        "Minimum timestamp for requested logs."
        + " Supports ISO-8601 strings or epoch milliseconds."
        + " Defaults to 15 minutes ago.",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description:
        "Maximum timestamp for requested logs."
        + " Supports ISO-8601 strings or epoch milliseconds."
        + " Defaults to now.",
      optional: true,
    },
    indexes: {
      type: "string[]",
      label: "Indexes",
      description:
        "List of log index names to search."
        + " Defaults to all indexes.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Max Results",
      description:
        "Maximum number of logs to return per page."
        + " Default `10`, max `1000`.",
      optional: true,
      min: 1,
      max: 1000,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort order for results.",
      optional: true,
      options: [
        {
          label: "Timestamp descending (newest first)",
          value: "-timestamp",
        },
        {
          label: "Timestamp ascending (oldest first)",
          value: "timestamp",
        },
      ],
    },
  },
  async run({ $ }) {
    const filter = {
      query: this.query,
    };
    if (this.from) filter.from = this.from;
    if (this.to) filter.to = this.to;
    if (this.indexes?.length) filter.indexes = this.indexes;

    const body = {
      filter,
    };
    if (this.sort) body.sort = this.sort;
    if (this.limit) {
      body.page = {
        limit: this.limit,
      };
    }

    const response = await this.datadog.searchLogs({
      $,
      data: body,
      region: this.region,
    });

    const count = response?.data?.length ?? 0;
    $.export(
      "$summary",
      `Found ${count} log${count === 1
        ? ""
        : "s"} matching query`,
    );

    return response;
  },
};
