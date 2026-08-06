import googleCloud from "../../google_cloud.app.mjs";
import logSeverity from "../../utils/logSeverity.mjs";
import constants from "../../common/constants.mjs";

export default {
  name: "Logging - Read Log Entries",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "google_cloud-logging-read-log-entries",
  description: "Read log entries from Google Cloud Logging, optionally scoped to a single log via `Log name`. The `Log name`, `Severity`, and `Filter` inputs are combined with `AND`, and up to `Max Results` entries are returned. [See the documentation](https://cloud.google.com/nodejs/docs/reference/logging/latest/logging/logging#_google_cloud_logging_Logging_getEntries_member_1_)",
  type: "action",
  props: {
    googleCloud,
    logName: {
      label: "Log name",
      description: "Restrict results to a single log, e.g. `my-log`. Run the **Logging - List Logs** action to find valid log names. Leave empty to read across all logs in the project.",
      type: "string",
      optional: true,
    },
    severity: {
      label: "Severity",
      description: "Restrict results to entries of this severity. [See the documentation](https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity)",
      type: "string",
      optional: true,
      options: logSeverity,
    },
    filter: {
      label: "Filter",
      description: "An advanced logs filter to further narrow results, e.g. `severity>=ERROR AND timestamp>=\"2026-01-01T00:00:00Z\"`. Combined with the `Log name` and `Severity` inputs using `AND`. [See the documentation](https://cloud.google.com/logging/docs/view/advanced_filters)",
      type: "string",
      optional: true,
    },
    orderBy: {
      label: "Order By",
      description: "The order in which to return entries, based on the entry timestamp. Defaults to newest first.",
      type: "string",
      optional: true,
      default: constants.LOG_ENTRY_ORDER_BY.TIMESTAMP_DESC,
      options: Object.values(constants.LOG_ENTRY_ORDER_BY),
    },
    maxResults: {
      label: "Max Results",
      description: "The maximum number of entries to return.",
      type: "integer",
      optional: true,
      default: 100,
      min: 1,
      max: 99999,
    },
  },
  async run({ $ }) {
    const logging = this.googleCloud.loggingClient();

    const filterParts = [
      this.severity && `severity=${this.severity}`,
      this.filter,
    ].filter(Boolean);

    const source = this.logName
      ? logging.log(this.logName)
      : logging;

    const pageSize = (remaining) => Math.min(remaining, constants.MAX_PAGE_SIZE);

    const entries = [];
    let query = {
      autoPaginate: false,
      pageSize: pageSize(this.maxResults),
      orderBy: this.orderBy,
      ...(filterParts.length && {
        filter: filterParts.join(" AND "),
      }),
    };

    do {
      const [
        pageEntries,
        nextQuery,
      ] = await source.getEntries(query);
      entries.push(...pageEntries);
      query = nextQuery && {
        ...nextQuery,
        autoPaginate: false,
        pageSize: pageSize(this.maxResults - entries.length),
      };
    } while (query && entries.length < this.maxResults);

    const results = entries.slice(0, this.maxResults);
    $.export("$summary", `Retrieved ${results.length} log entr${results.length === 1
      ? "y"
      : "ies"}`);
    return results;
  },
};
