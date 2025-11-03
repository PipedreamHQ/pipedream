import ipinfo_io from "../../ipinfo_io.app.mjs";

export default {
  name: "Lookup ASN",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "ipinfo_io-lookup-asn",
  description: "Lookup an ASN. [See docs here](https://ipinfo.io/developers/asn)",
  type: "action",
  props: {
    ipinfo_io,
    asn: {
      label: "ASN",
      description: "The ASN to lookup. E.g. `AS7922`",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.ipinfo_io.lookupASN({
      $,
      asn: this.asn,
    });

    if (response) {
      $.export("$summary", `Successfully looked up IP \`${this.ip}\``);
    }

    return response;
  },
};
