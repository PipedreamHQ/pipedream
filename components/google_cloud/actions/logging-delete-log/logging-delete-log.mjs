import googleCloud from "../../google_cloud.app.mjs";

export default {
  name: "Logging - Delete Log",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "google_cloud-logging-delete-log",
  description: "Delete a log and all of its entries. The log will reappear if new entries are written to it. This cannot be undone. [See the documentation](https://cloud.google.com/nodejs/docs/reference/logging/latest/logging/log#_google_cloud_logging_Log_delete_member_1_)",
  type: "action",
  props: {
    googleCloud,
    logName: {
      label: "Log name",
      description: "The name of the log to delete, e.g. `my-log`. Run the **Logging - List Logs** action to find valid log names.",
      type: "string",
    },
  },
  async run({ $ }) {
    const logging = this.googleCloud.loggingClient();
    const log = logging.log(this.logName);
    await log.delete();
    $.export("$summary", `Deleted log \`${this.logName}\``);
  },
};
