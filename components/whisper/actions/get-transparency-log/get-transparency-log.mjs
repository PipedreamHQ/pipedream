import app from "../../whisper.app.mjs";

export default {
  key: "whisper-get-transparency-log",
  name: "Get Transparency Log",
  description: "Fetch the hash-chained transparency log for a Whisper agent IPv6 address: every issuance and revocation event, each linked to the previous by proof hash, plus the signed Merkle root and its inclusion checkpoint in the public `whisper.online/ledger`. This is keyless and anonymous — no API key or account is required. Use this to audit an identity's history and prove it has not been silently re-issued or tampered with. Use **Verify Agent Identity** for the current verdict and **Lookup RDAP Record** for the registry record. [See the documentation](https://whisper.online/platform)",
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
    const response = await this.app.getTransparencyLog({
      $,
      address: this.address,
    });
    $.export("$summary", `Retrieved ${response.count} transparency event(s) for ${this.address}`);
    return response;
  },
};
