import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-retry-monitor",
  name: "Retry Monitor",
  description: "Retry a failed monitor process. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/monitors/process_retry)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pubrio,
    monitorId: {
      type: "string",
      label: "Monitor ID",
      description: "The monitor ID to retry",
    },
    monitorLogId: {
      type: "string",
      label: "Monitor Log ID",
      description: "The monitor log ID to retry",
    },
    isUseOriginalDestination: {
      type: "boolean",
      label: "Use Original Destination",
      description: "Whether to use the original destination for retry",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      monitor_id: this.monitorId,
      monitor_log_id: this.monitorLogId,
    };
    if (this.isUseOriginalDestination != null) {
      data.is_use_original_destination = this.isUseOriginalDestination;
    }
    const response = await this.pubrio.retryMonitor({
      $,
      data,
    });
    $.export("$summary", `Successfully retried monitor ${this.monitorId}`);
    return response;
  },
};
