import whoisfreaks from "../../whoisfreaks.app.mjs";

export default {
  key: "whoisfreaks-whois-history-lookup",
  name: "WHOIS History Lookup",
  description: "Retrieve the full WHOIS ownership timeline for a domain: every unique WHOIS record captured since 1986, ordered from most recent to oldest, with registrant, registrar, nameserver and date changes. Use this to see who owned a domain before and when registration details changed. [See the documentation](https://whoisfreaks.com/documentation/whois-history-api)",
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
    domainName: {
      propDefinition: [
        whoisfreaks,
        "domainName",
      ],
    },
    format: {
      propDefinition: [
        whoisfreaks,
        "format",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.whoisfreaks.lookupWhoisHistory({
      $,
      params: {
        domainName: this.domainName,
        whois: "historical",
        format: this.format,
      },
    });
    $.export("$summary", `Successfully retrieved WHOIS history for domain ${this.domainName}`);
    return response;
  },
};
