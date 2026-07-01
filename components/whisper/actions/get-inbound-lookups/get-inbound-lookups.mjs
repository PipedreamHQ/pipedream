import app from "../../whisper.app.mjs";

export default {
  key: "whisper-get-inbound-lookups",
  name: "Get Inbound Lookups",
  description: "Fetch the inbound identity-lookup feed for a Whisper agent IPv6 address — the recent record of who has been resolving or verifying this identity (timestamp, query name, query type, response code, and source). This is keyless and anonymous — no API key or account is required. Use this for observability: to see whether and how often an agent's identity is being checked by counterparties. Use **Verify Agent Identity** to verify the identity itself. [See the documentation](https://nic.whisper.online)",
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
    const response = await this.app.getInboundLookups({
      $,
      address: this.address,
    });
    $.export("$summary", `Retrieved ${response.count} inbound lookup(s) for ${this.address}`);
    return response;
  },
};
