import app from "../../whisper.app.mjs";

export default {
  key: "whisper-lookup-rdap-record",
  name: "Lookup RDAP Record",
  description: "Fetch the RDAP (RFC 9083) registry record for a Whisper agent IPv6 address — handle, name, registrant entity, status, country, and registration events, with `related` links to the forward/reverse DNS and the upstream RIR. This is keyless and anonymous — no API key or account is required. Returns a `404` RDAP error object if no Whisper agent identity anchors the address. Use **Verify Agent Identity** for a live verification verdict instead of the registry record. [See the documentation](https://nic.whisper.online)",
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
    const response = await this.app.getRdapRecord({
      $,
      address: this.address,
    });
    $.export("$summary", `Retrieved RDAP record for ${this.address}`);
    return response;
  },
};
