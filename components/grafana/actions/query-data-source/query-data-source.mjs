// vandelay-test-dr
import grafana from "../../grafana.app.mjs";

export default {
  key: "grafana-query-data-source",
  name: "Query Data Source",
  description:
    "Execute a query against any configured data source."
    + " Use **List Data Sources** first to discover available"
    + " data sources and their UIDs."
    + " The query language depends on the data source type:"
    + "\n\n"
    + "**Prometheus** (PromQL):"
    + " `rate(http_requests_total[5m])`,"
    + " `sum by (status_code)"
    + " (rate(http_requests_total[5m]))`"
    + "\n\n"
    + "**Loki** (LogQL):"
    + " `{app=\"myapp\"} |= \"error\"`,"
    + " `rate({app=\"myapp\"}[5m])`"
    + "\n\n"
    + "**Note:** This tool uses the `expr` query field, which"
    + " works with Prometheus and Loki. For SQL-based data"
    + " sources (MySQL, Postgres) or InfluxDB, the query field"
    + " name differs and may not work with this tool."
    + "\n\n"
    + "Time range defaults to last 1 hour. Use `from` and `to`"
    + " for custom ranges (supports relative: `now-24h`,"
    + " `now-7d`, or epoch milliseconds).",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    grafana,
    datasourceUid: {
      type: "string",
      label: "Data Source UID",
      description:
        "The UID of the data source to query. Use **List Data"
        + " Sources** to discover available data sources.",
    },
    expression: {
      type: "string",
      label: "Query Expression",
      description:
        "The query expression in the data source's native"
        + " language (PromQL, LogQL, SQL, Flux, etc.).",
    },
    from: {
      type: "string",
      label: "From",
      description:
        "Start of the time range. Supports relative times like"
        + " `now-1h`, `now-24h`, `now-7d`, or epoch"
        + " milliseconds. Default: `now-1h`.",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description:
        "End of the time range. Supports relative times like"
        + " `now` or epoch milliseconds. Default: `now`.",
      optional: true,
    },
    intervalMs: {
      type: "integer",
      label: "Interval (ms)",
      description:
        "Step interval in milliseconds for time-series queries.",
      optional: true,
    },
    maxDataPoints: {
      type: "integer",
      label: "Max Data Points",
      description:
        "Maximum number of data points to return."
        + " Default: 100.",
      optional: true,
    },
  },
  async run({ $ }) {
    const fromTime = this.from || "now-1h";
    const toTime = this.to || "now";

    const data = {
      from: fromTime,
      to: toTime,
      queries: [
        {
          refId: "A",
          datasource: {
            uid: this.datasourceUid,
          },
          expr: this.expression,
          intervalMs: this.intervalMs || 15000,
          maxDataPoints: this.maxDataPoints || 100,
        },
      ],
    };

    const response = await this.grafana.queryDatasource($, data);

    const frameCount = response?.results?.A?.frames?.length || 0;

    $.export(
      "$summary",
      `Query returned ${frameCount} data frame${frameCount === 1
        ? ""
        : "s"}`,
    );

    return response;
  },
};
