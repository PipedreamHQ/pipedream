import googleCloud from "../../google_cloud.app.mjs";

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
  },
  async run({ $ }) {
    const logging = this.googleCloud.loggingClient();
    const [
      logs,
    ] = await logging.getLogs();
    const logNames = logs.map((log) => log.name);
    $.export("$summary", `Found ${logNames.length} log${logNames.length === 1
      ? ""
      : "s"}`);
    return logNames;
  },
};
