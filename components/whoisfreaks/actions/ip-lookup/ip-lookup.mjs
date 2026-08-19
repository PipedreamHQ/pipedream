import whoisfreaks from "../../whoisfreaks.app.mjs";

export default {
  key: "whoisfreaks-ip-lookup",
  name: "IP Lookup",
  description: "Retrieve information about an IP address. [See the documentation](https://whoisfreaks.com/documentation/ip-whois-api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    whoisfreaks,
    ip: {
      propDefinition: [whoisfreaks, "ip"],
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
