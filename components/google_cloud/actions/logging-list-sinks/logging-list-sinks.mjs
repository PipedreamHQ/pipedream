import googleCloud from "../../google_cloud.app.mjs";

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
  },
  async run({ $ }) {
    const logging = this.googleCloud.loggingClient();
    const [
      sinks,
    ] = await logging.getSinks();
    const metadata = sinks.map((sink) => sink.metadata);
    $.export("$summary", `Found ${metadata.length} log sink${metadata.length === 1
      ? ""
      : "s"}`);
    return metadata;
  },
};
