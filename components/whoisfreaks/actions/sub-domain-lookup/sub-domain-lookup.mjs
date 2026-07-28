import whoisfreaks from "../../whoisfreaks.app.mjs";

export default {
  key: "whoisfreaks-sub-domain-lookup",
  name: "Subdomain Lookup",
  description:
    "Discover subdomains for a given domain using passive DNS data from 6.3B+ indexed hostnames. Returns active, inactive, and historical subdomain records. Use this action for attack surface mapping, security audits, or competitor research. Returns JSON or XML output. [See the documentation](https://whoisfreaks.com/documentation/subdomains-api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    readOnlyHint: true,
    openWorldHint: true,
  },
  type: "action",
  props: {
    whoisfreaks,
    domainName: {
      propDefinition: [whoisfreaks, "domainName"],
    },
    format: {
      propDefinition: [whoisfreaks, "format"],
    },
    page: {
      type: "integer",
      label: "Page",
      description:
        "For getting next or desired page of whois info. Default: `1`",
      default: 1,
      min: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.whoisfreaks.lookupSubDomain({
      $,
      params: {
        domain: this.domainName,
        format: this.format,
        page: this.page || 1,
      },
    });
    $.export("$summary", `Successfully fetched subdomain data for ${this.domainName}`);
    return response;
  },
};
