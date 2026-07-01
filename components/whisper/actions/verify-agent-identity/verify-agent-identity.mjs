import app from "../../whisper.app.mjs";

export default {
  key: "whisper-verify-agent-identity",
  name: "Verify Agent Identity",
  description: "Verify whether an IPv6 address is a genuine Whisper agent identity and return the full verdict (`is_whisper_agent`, `fqdn`, `operator`, `tenant`, `dane_ok`, `jws_ok`, and the underlying DNS/DANE evidence). This is keyless and anonymous — no API key or account is required. Use this to answer \"is this agent who it claims to be?\". Use **Lookup RDAP Record** for the registry record, **Get Transparency Log** for the hash-chained issuance history, and **Get Inbound Lookups** for who has been checking this identity. [See the documentation](https://whisper.online/platform)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    address: {
      propDefinition: [
        app,
        "address",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.verifyIdentity({
      $,
      address: this.address,
    });
    $.export("$summary", response.is_whisper_agent
      ? `${this.address} is a verified Whisper agent (${response.fqdn})`
      : `${this.address} is not a Whisper agent identity`);
    return response;
  },
};
