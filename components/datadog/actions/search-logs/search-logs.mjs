import logProps from "../common/log-props.mjs";

export default {
  key: "datadog-search-logs",
  name: "Search Logs",
  description:
    "Search Datadog logs matching a query with support"
    + " for facets and time ranges. Uses log search"
    + " syntax: `service:web-app status:error`,"
    + " `@http.status_code:>=400`, boolean operators"
    + " (AND, OR, NOT), and wildcards. Set `from` to"
    + " `now-1h` for recent logs. Use **Search Metrics**"
    + " to discover metric names or **Search Hosts** to"
    + " find host names for filtering. To investigate an"
    + " incident, use **Search Incidents** first, then"
    + " search logs for that time window and service."
    + " [See the docs](https://docs.datadoghq.com/api/"
    + "latest/logs/#search-logs)",
  version: "1.0.1",
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
