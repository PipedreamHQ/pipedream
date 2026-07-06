import googleCloud from "../../google_cloud.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  name: "Logging - List Log Sinks",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "google_cloud-logging-list-sinks",
  description: "List the log sinks used to export log entries in your project. [See the documentation](https://cloud.google.com/nodejs/docs/reference/logging/latest/logging/logging#_google_cloud_logging_Logging_getSinks_member_1_)",
  type: "action",
  props: {
    googleCloud,
    maxResults: {
      label: "Max Results",
      description: "The maximum number of log sinks to return.",
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

    const sinks = [];
    let query = {
      autoPaginate: false,
      pageSize: pageSize(this.maxResults),
    };

    do {
      const [
        pageSinks,
        nextQuery,
      ] = await logging.getSinks(query);
      sinks.push(...pageSinks);
      query = nextQuery && {
        ...nextQuery,
        autoPaginate: false,
        pageSize: pageSize(this.maxResults - sinks.length),
      };
    } while (query && sinks.length < this.maxResults);

    const metadata = sinks.slice(0, this.maxResults).map((sink) => sink.metadata);
    $.export("$summary", `Found ${metadata.length} log sink${metadata.length === 1
      ? ""
      : "s"}`);
    return metadata;
  },
};
