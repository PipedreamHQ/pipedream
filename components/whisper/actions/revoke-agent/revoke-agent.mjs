import app from "../../whisper.app.mjs";

export default {
  key: "whisper-revoke-agent",
  name: "Revoke Agent",
  description: "Fully revoke an agent (`op:revoke`) — withdraw its IPv6 `/128`, PTR, egress tokens and its API key. This is **irreversible**. Select the agent by its id or its `/128` address. Requires a connected Whisper account (your `whisper_live_` key with the `admin:dns` scope). [See the documentation](https://whisper.online/platform)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
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
    const records = await this.app.revokeAgent({
      $,
      agent: this.agent,
    });
    const status = records?.[0]?.status ?? records?.[0]?.state ?? "submitted";
    $.export("$summary", `Agent ${this.agent}: ${status}`);
    return records?.[0] ?? {};
  },
};
