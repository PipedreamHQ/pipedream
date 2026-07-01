import app from "../../whisper.app.mjs";

export default {
  key: "whisper-register-agent",
  name: "Register Agent",
  description: "Mint a brand-new Whisper agent with its own routable IPv6 `/128` identity **and** its own API key (`op:register`). Returns the agent id, address, FQDN, PTR, state, and the new agent's `api_key` — which is shown **once**, so capture it now. Requires a connected Whisper account (your `whisper_live_` key with the `admin:dns` scope). [See the documentation](https://whisper.online/platform)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    label: {
      propDefinition: [
        app,
        "label",
      ],
    },
    contactEmail: {
      propDefinition: [
        app,
        "contactEmail",
      ],
    },
  },
  async run({ $ }) {
    const records = await this.app.registerAgent({
      $,
      label: this.label,
      contactEmail: this.contactEmail,
    });
    const agent = records?.[0] ?? {};
    $.export("$summary", agent.address
      ? `Registered agent ${agent.agent ?? this.label} at ${agent.address}`
      : `Registered agent ${this.label}`);
    return agent;
  },
};
