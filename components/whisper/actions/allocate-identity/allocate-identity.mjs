import app from "../../whisper.app.mjs";

export default {
  key: "whisper-allocate-identity",
  name: "Allocate Identity",
  description: "Allocate a routable IPv6 `/128` identity to **your own** caller account (`op:identity`) — unlike **Register Agent**, no new agent or API key is minted; the address, FQDN and PTR are bound to the calling key itself. Requires a connected Whisper account (your `whisper_live_` key). [See the documentation](https://whisper.online/platform)",
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
    const records = await this.app.allocateIdentity({
      $,
      label: this.label,
      contactEmail: this.contactEmail,
    });
    const identity = records?.[0] ?? {};
    $.export("$summary", identity.address
      ? `Allocated identity ${identity.address} (${identity.fqdn ?? this.label})`
      : `Allocated identity ${this.label}`);
    return identity;
  },
};
