import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-monitor",
  name: "Get Monitor",
  description: "Get detailed information about a specific monitor. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/monitors/lookup)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
    monitorId: {
      type: "string",
      label: "Monitor ID",
      description: "The monitor ID to look up",
    },
    isSignatureReveal: {
      type: "boolean",
      label: "Reveal Signature",
      description: "Whether to reveal the monitor signature",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      monitor_id: this.monitorId,
    };
    if (this.isSignatureReveal != null) data.is_signature_reveal = this.isSignatureReveal;
    const response = await this.pubrio.getMonitor({
      $,
      data,
    });
    $.export("$summary", `Successfully retrieved monitor ${this.monitorId}`);
    return response;
  },
};
