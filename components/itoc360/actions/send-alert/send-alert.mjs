import itoc360 from "../../itoc360.app.mjs";

export default {
  key: "itoc360-send-alert",
  name: "Send Alert to ITOC360",
  description: "Creates or resolves an alert in ITOC360. Use status `trigger` to open an alert, and `resolve` (with the same Deduplication ID) to close it. [See the documentation](https://docs.itoc360.com/integrations/inbound-integrations/workflow-and-automation/zapier-integration).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    itoc360,
    title: {
      type: "string",
      label: "Title",
      description: "A short summary of the alert.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Use `trigger` to open an alert, or `resolve` to close an existing one with the same Deduplication ID.",
      options: [
        "trigger",
        "resolve",
      ],
      default: "trigger",
    },
    id: {
      type: "string",
      label: "Deduplication ID",
      description: "A unique identifier used to correlate and de-duplicate alerts. Send the same ID with status `resolve` to close the alert opened with `trigger` (e.g. `server-42-disk-full` or `prod-us-east-1-api-latency`). If omitted, the title is used.",
      optional: true,
    },
    severity: {
      type: "string",
      label: "Severity",
      description: "The severity of the alert.",
      options: [
        "critical",
        "high",
        "medium",
        "low",
      ],
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "An optional, longer description of the alert.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      itoc360,
      title,
      status,
      id,
      severity,
      message,
    } = this;

    const response = await itoc360.sendEvent({
      $,
      data: {
        title,
        status,
        id,
        severity,
        message,
      },
    });

    $.export("$summary", `Successfully sent "${status}" event to ITOC360${title ? ` for "${title}"` : ""}.`);

    return response;
  },
};