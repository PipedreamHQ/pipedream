import googleCloud from "../../google_cloud.app.mjs";
import logSeverity from "../../utils/logSeverity.mjs";

export default {
  name: "Logging - Write Log",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "google_cloud-logging-write-log",
  description: "Writes log data to the Logging service, [See the docs](https://cloud.google.com/nodejs/docs/reference/logging/latest/logging/log#_google_cloud_logging_Log_write_member_1_)",
  props: {
    googleCloud,
    logName: {
      label: "Log name",
      description: "The log name you'd like to write to",
      type: "string",
    },
    text: {
      label: "Text",
      description: "The data you'd like to write to the log",
      type: "string",
    },
    severity: {
      label: "Severity",
      description: "The data you'd like to write to the log, [See the docs](https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity)",
      type: "string",
      optional: true,
      default: "DEFAULT",
      options: logSeverity,
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const logger = this.googleCloud.loggingClient();
    const log = logger.log(this.logName);
    const metadata = {
      // See: https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
      severity: this.severity,
    };

    const entry = log.entry(metadata, this.text);
    await log.write(entry);
    $.export("$summary", `Logged: ${this.text}`);
  },
};
