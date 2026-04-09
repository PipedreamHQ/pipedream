import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-reveal-monitor-signature",
  name: "Reveal Monitor Signature",
  description: "Reveal the signature for a specific monitor. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
  },
  props: {
    pubrio,
    monitorId: {
      type: "string",
      label: "Monitor ID",
      description: "The monitor ID to reveal the signature for",
    },
  },
  async run({ $ }) {
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/monitors/signature/reveal",
      data: { monitor_id: this.monitorId },
    });
    $.export("$summary", "Successfully revealed monitor signature");
    return response;
  },
};
