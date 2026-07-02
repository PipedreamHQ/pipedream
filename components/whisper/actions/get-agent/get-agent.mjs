import app from "../../whisper.app.mjs";

export default {
  key: "whisper-get-agent",
  name: "Get Agent",
  description: "Fetch one agent's full detail and live counters (`op:agent`) — id, address, FQDN, PTR, label, state, allocation time, last-seen, DNS query/block counts, traffic bytes and connection counters. Select the agent by its id or its `/128` address. Requires a connected Whisper account (your `whisper_live_` key). [See the documentation](https://whisper.online/platform)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    agent: {
      propDefinition: [
        app,
        "agent",
      ],
    },
  },
  async run({ $ }) {
    const records = await this.app.getAgent({
      $,
      agent: this.agent,
    });
    const detail = records?.[0] ?? {};
    $.export("$summary", detail.agent
      ? `Agent ${detail.agent} (${detail.address ?? this.agent}): ${detail.state ?? "found"}`
      : `Agent ${this.agent} retrieved`);
    return detail;
  },
};
