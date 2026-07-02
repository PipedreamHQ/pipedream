import app from "../../whisper.app.mjs";

export default {
  key: "whisper-connect-egress",
  name: "Connect Egress",
  description: "Get an egress configuration bound to an agent's routable IPv6 `/128` (`op:connect`) — a hosted SOCKS5/HTTP proxy (default) or a routed WireGuard tunnel — so the agent's traffic verifiably sources from its Whisper identity. By default the returned config is **stripped of its secrets** (proxy credential URLs, private keys) before it reaches your workflow's step exports; enable **Include Secrets** only when a downstream step consumes them directly. Requires a connected Whisper account (your `whisper_live_` key). [See the documentation](https://whisper.online/platform)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    agent: {
      propDefinition: [
        app,
        "connectAgent",
      ],
    },
    tier: {
      propDefinition: [
        app,
        "tier",
      ],
    },
    publicKey: {
      propDefinition: [
        app,
        "publicKey",
      ],
    },
    includeSecrets: {
      propDefinition: [
        app,
        "includeSecrets",
      ],
    },
  },
  async run({ $ }) {
    const records = await this.app.connectEgress({
      $,
      agent: this.agent,
      tier: this.tier,
      publicKey: this.publicKey,
    });
    let record = records?.[0] ?? {};
    if (!this.includeSecrets) {
      record = this.app.stripEgressSecrets(record);
    }
    $.export("$summary", record.address
      ? `${record.tier ?? this.tier ?? "socks5"} egress ready for ${record.address}${this.includeSecrets
        ? ""
        : " (secrets stripped)"}`
      : "Egress configuration returned");
    return record;
  },
};
