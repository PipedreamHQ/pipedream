import { randomUUID } from "crypto";
import logbrew from "../../logbrew.app.mjs";

export default {
  key: "logbrew-send-log",
  name: "Send Log",
  description: "Send one log line to a LogBrew project. Needs an ingest key in the connection. [See the documentation](https://docs.logbrew.co/guides/sdk-ingestion)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    logbrew,
    projectId: {
      propDefinition: [
        logbrew,
        "projectId",
      ],
      description: "The ID of the project that receives the log, e.g. `11111111-1111-4111-8111-111111111111`. Use the project of your ingest key. Use **List Projects** to find it (the `id` field).",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The log message, e.g. `Order sync failed for order A-1001`",
    },
    level: {
      type: "string",
      label: "Level",
      description: "The log level, e.g. `info`",
      options: [
        "debug",
        "info",
        "warning",
        "error",
        "critical",
      ],
      default: "info",
    },
    serviceName: {
      type: "string",
      label: "Service Name",
      description: "The service that LogBrew groups this log under, e.g. `order-worker`",
      default: "pipedream",
    },
    release: {
      type: "string",
      label: "Release",
      description: "The release, version, or commit of the service, e.g. `v1.2.3`",
      default: "workflow",
    },
    environment: {
      type: "string",
      label: "Environment",
      description: "The deployment environment, e.g. `production` or `staging`",
      default: "production",
      optional: true,
    },
    attributes: {
      type: "object",
      label: "Attributes",
      description: "Extra fields to store with the log, e.g. `{ \"order_id\": \"A-1001\" }`",
      optional: true,
    },
  },
  async run({ $ }) {
    const attributes = typeof this.attributes === "string"
      ? JSON.parse(this.attributes)
      : this.attributes;
    const response = await this.logbrew.ingest({
      $,
      data: {
        project_id: this.projectId,
        environment: this.environment || "production",
        release: this.release,
        service_name: this.serviceName,
        sdk_name: "pipedream-logbrew",
        sdk_version: "0.1.0",
        items: [
          {
            type: "log",
            data: {
              id: randomUUID(),
              level: this.level,
              message: this.message,
              source: "pipedream",
              attributes: attributes || {},
              occurred_at: new Date().toISOString(),
            },
          },
        ],
      },
    });
    $.export("$summary", `Successfully sent ${this.level} log to LogBrew`);
    return response;
  },
};
