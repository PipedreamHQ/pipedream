import logProps from "../common/log-props.mjs";

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
  props: logProps,
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
