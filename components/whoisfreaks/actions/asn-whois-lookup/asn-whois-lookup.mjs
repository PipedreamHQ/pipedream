import whoisfreaks from "../../whoisfreaks.app.mjs";

export default {
  key: "whoisfreaks-asn-whois-lookup",
  name: "ASN WHOIS Lookup",
  description: "Retrieve WHOIS details for an Autonomous System Number (ASN), including the AS name, organization, country, allocation status, IPv4 and IPv6 routes, upstream and downstream providers, peers, and abuse and technical contacts. [See the documentation](https://whoisfreaks.com/documentation/asn-whois-api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    whoisfreaks,
    asn: {
      type: "string",
      label: "ASN",
      description: "The Autonomous System Number to look up, with or without the `AS` prefix (e.g. `AS15169` or `15169`)",
    },
    format: {
      propDefinition: [
        whoisfreaks,
        "format",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.whoisfreaks.lookupAsnWhois({
      $,
      params: {
        asn: this.asn,
        format: this.format,
      },
    });
    $.export("$summary", `Successfully retrieved WHOIS data for ASN ${this.asn}`);
    return response;
  },
};
