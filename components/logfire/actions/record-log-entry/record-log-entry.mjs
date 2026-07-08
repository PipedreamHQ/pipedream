import {
  BasicTracerProvider, SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { SpanStatusCode } from "@opentelemetry/api";
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
    + " After recording, use **Run SQL Query** to confirm what was written (e.g. `SELECT * FROM records WHERE message LIKE '%...%' ORDER BY start_timestamp DESC LIMIT 1`). [See the documentation](https://pydantic.dev/docs/logfire/typescript-sdk/packages/browser/)",
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
    const level = this.level || "info";
    const serviceName = this.serviceName || "pipedream";
    const attributes = this.attributes
      ? JSON.parse(this.attributes)
      : {};
    const isException = Boolean(this.exceptionType || this.exceptionMessage);

    const exporter = new OTLPTraceExporter({
      url: `${this.app._baseUrl()}/v1/traces`,
      headers: {
        Authorization: `Bearer ${this.app._writeToken()}`,
      },
    });

    const provider = new BasicTracerProvider({
      resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: serviceName,
      }),
      spanProcessors: [
        new SimpleSpanProcessor(exporter),
      ],
    });

    const tracer = provider.getTracer("pipedream-logfire-record-log-entry");
    const span = tracer.startSpan(this.spanName || this.message);

    span.setAttribute("logfire.msg", this.message);
    span.setAttribute("logfire.level_num", LEVEL_NUMBERS[level]);
    for (const [
      key,
      value,
    ] of Object.entries(attributes)) {
      span.setAttribute(key, value);
    }

    if (isException) {
      span.recordException({
        name: this.exceptionType || "Error",
        message: this.exceptionMessage || "",
      });
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: this.exceptionMessage || this.message,
      });
    }

    span.end();
    await provider.forceFlush();
    await provider.shutdown();

    $.export("$summary", `Recorded ${level} log entry: "${this.message}"${isException
      ? " (flagged as an exception)"
      : ""}`);

    return {
      message: this.message,
      level,
      serviceName,
      isException,
    };
  },
};
