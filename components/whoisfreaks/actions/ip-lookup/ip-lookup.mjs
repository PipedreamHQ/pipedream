import whoisfreaks from "../../whoisfreaks.app.mjs";

export default {
  key: "whoisfreaks-ip-lookup",
  name: "IP Lookup",
  description: "Retrieve information about an IP address. [See the documentation](https://whoisfreaks.com/products/whois-api#ip_lookup)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    whoisfreaks,
    ip: {
      type: "string",
      label: "IP",
      description: "IPv4 or IPv6 address for the requested whois",
    },
    format: {
      propDefinition: [
        whoisfreaks,
        "format",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.whoisfreaks.ipLookup({
      $,
      params: {
        ip: this.ip,
        format: this.format,
      },
    });
    $.export("$summary", `Successfully performed lookup for IP ${this.ip}`);
    return response;
  },
};
