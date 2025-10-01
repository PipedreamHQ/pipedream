import ncscale from "../../ncscale.app.mjs";

export default {
  key: "ncscale-push-log",
  name: "Push Log",
  description: "Pushes a new log entry to the ncscale app. [See the documentation](https://documentation.ncscale.io/docs/api/push-log)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ncscale,
    message: {
      type: "string",
      label: "Log Message",
      description: "The details of the log entry.",
    },
    createdAt: {
      type: "integer",
      label: "Created At",
      description: "The timestamp when the log was created. Format: Timestamp UTC",
    },
    severity: {
      type: "string",
      label: "Severity",
      description: "The type of log event.",
      options: [
        {
          label: "Verbose",
          value: "verbose",
        },
        {
          label: "Info",
          value: "info",
        },
        {
          label: "Warning",
          value: "warning",
        },
        {
          label: "Error",
          value: "error",
        },
        {
          label: "Critical",
          value: "critical",
        },
      ],
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The name of the event.",
    },
    extra: {
      type: "object",
      label: "Extra Information",
      description: "An object with further information. Keys must follow specific format rules.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ncscale.pushLog({
      $,
      data: {
        createdAt: this.createdAt,
        event_name: this.eventName,
        extra: this.extra,
        message: this.message,
        severity: this.severity,
      },
    });
    $.export("$summary", `Successfully pushed log entry with Id: ${response.SendMessageResponse?.SendMessageResult?.MessageId}`);
    return response;
  },
};
