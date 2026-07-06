import googleCloud from "../../google_cloud.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  name: "Logging - List Logs",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "google_cloud-logging-list-logs",
  description: "List the names of the logs that have entries in your project. Use a returned log name as the `Log name` input of the **Logging - Read Log Entries** action. [See the documentation](https://cloud.google.com/nodejs/docs/reference/logging/latest/logging/logging#_google_cloud_logging_Logging_getLogs_member_1_)",
  type: "action",
  props: {
    googleCloud,
    maxResults: {
      label: "Max Results",
      description: "The maximum number of log names to return.",
      type: "integer",
      optional: true,
      default: 100,
      min: 1,
      max: 99999,
    },
  },
  async run({ $ }) {
    const logging = this.googleCloud.loggingClient();
    const pageSize = (remaining) => Math.min(remaining, constants.MAX_PAGE_SIZE);

    const logs = [];
    let query = {
      autoPaginate: false,
      pageSize: pageSize(this.maxResults),
    };

    do {
      const [
        pageLogs,
        nextQuery,
      ] = await logging.getLogs(query);
      logs.push(...pageLogs);
      query = nextQuery && {
        ...nextQuery,
        autoPaginate: false,
        pageSize: pageSize(this.maxResults - logs.length),
      };
    } while (query && logs.length < this.maxResults);

    const logNames = logs.slice(0, this.maxResults).map((log) => log.name);
    $.export("$summary", `Found ${logNames.length} log${logNames.length === 1
      ? ""
      : "s"}`);
    return logNames;
  },
};
