import { ConfigurationError } from "@pipedream/platform";
import { LEVEL_NUMBERS } from "../../common/constants.mjs";
import app from "../../logfire.app.mjs";

export default {
  key: "logfire-record-log-entry",
  name: "Record Log Entry",
  description:
    "Records a single log entry or event in Logfire as a zero-duration span, via OTLP ingestion."
    + " Use this whenever the user wants to log, record, or note an event, deployment, incident, or error — this is Logfire's equivalent of calling `logfire.info()`/`logfire.error()` from the SDK."
    + " This creates a single point-in-time entry, not a full distributed trace with parent/child spans."
    + " Setting `exceptionType`/`exceptionMessage` marks the entry as an exception (`is_exception = true` when later queried)."
    + " After recording, use **Run SQL Query** to confirm what was written (e.g. `SELECT * FROM records WHERE message LIKE '%...%' ORDER BY start_timestamp DESC LIMIT 1`). [See the documentation](https://pydantic.dev/docs/logfire/reference/sql/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    message: {
      type: "string",
      label: "Message",
      description: "The log message to record, e.g. `Deployment v2.4.1 went out successfully`.",
    },
    level: {
      type: "string",
      label: "Level",
      description: "The severity level of the log entry.",
      options: Object.keys(LEVEL_NUMBERS),
      default: "info",
      optional: true,
    },
    spanName: {
      type: "string",
      label: "Span Name",
      description: "A short name for the span, used to group similar entries. Defaults to the message if not provided.",
      optional: true,
    },
    serviceName: {
      type: "string",
      label: "Service Name",
      description: "The name of the service this log entry is attributed to.",
      default: "pipedream",
      optional: true,
    },
    attributes: {
      type: "string",
      label: "Attributes",
      description: "Optional JSON object of additional key-value attributes to attach to the entry."
        + " Example: `{\"customer_id\": \"12345\", \"region\": \"us-east\"}`.",
      optional: true,
    },
    exceptionType: {
      type: "string",
      label: "Exception Type",
      description: "If this entry represents an exception, the exception's type/class name, e.g. `ValueError`.",
      optional: true,
    },
    exceptionMessage: {
      type: "string",
      label: "Exception Message",
      description: "If this entry represents an exception, the exception's message. Setting this (with `exceptionType`) marks the span as an exception in Logfire.",
      optional: true,
    },
  },
  async run({ $ }) {
    let attributes = {};
    if (this.attributes) {
      try {
        attributes = JSON.parse(this.attributes);
      } catch (error) {
        throw new ConfigurationError("Syntax error in `Attributes` property");
      }
      if (typeof attributes !== "object" || attributes === null || Array.isArray(attributes)) {
        throw new ConfigurationError("`Attributes` property must be a JSON object");
      }
    }

    const result = await this.app.recordLogEntry({
      message: this.message,
      level: this.level || "info",
      spanName: this.spanName,
      serviceName: this.serviceName || "pipedream",
      attributes,
      exceptionType: this.exceptionType,
      exceptionMessage: this.exceptionMessage,
    });

    $.export("$summary", `Recorded ${result.level} log entry: "${result.message}"${result.isException
      ? " (flagged as an exception)"
      : ""}`);

    return result;
  },
};
