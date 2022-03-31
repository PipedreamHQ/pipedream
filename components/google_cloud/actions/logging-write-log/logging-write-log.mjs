/* eslint-disable camelcase */
import google_cloud from "../../google_cloud.app.mjs";
import logSeverity from "../../utils/logSeverity.mjs";

export default {
  name: "Logging - Write Log",
  version: "0.0.1",
  key: "google_cloud-logging-write-log",
  description: "Writes log data to the Logging service",
  props: {
    google_cloud,
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
      description: "The data you'd like to write to the log",
      type: "string",
      optional: true,
      default: "DEFAULT",
      options: logSeverity,
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const logger = this.google_cloud.loggingClient();
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
