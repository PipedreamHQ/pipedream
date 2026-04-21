import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-reveal-monitor-signature",
  name: "Reveal Monitor Signature",
  description: "Reveal the signature for a specific monitor. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/monitors/signature_reveal)",
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
      description: "The monitor ID to reveal the signature for",
    },
  },
  async run({ $ }) {
    const response = await this.pubrio.revealMonitorSignature({
      $,
      data: {
        monitor_id: this.monitorId,
      },
    });
    $.export("$summary", `Successfully revealed signature for monitor ${this.monitorId}`);
    return response;
  },
};
