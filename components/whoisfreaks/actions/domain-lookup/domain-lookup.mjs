import whoisfreaks from "../../whoisfreaks.app.mjs";

export default {
  key: "whoisfreaks-domain-lookup",
  name: "Domain Lookup",
  description: "Retrieve details about a domain name. [See the documentation](https://whoisfreaks.com/products/whois-api#live_lookup)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    whoisfreaks,
    domainName: {
      propDefinition: [
        whoisfreaks,
        "domainName",
      ],
    },
    lookupType: {
      type: "string",
      label: "Lookup Type",
      description: "Whether to perform a `live` or `historical` lookup",
      options: [
        "live",
        "historical",
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
    const response = await this.whoisfreaks.domainLookup({
      $,
      params: {
        domainName: this.domainName,
        whois: this.lookupType,
        format: this.format,
      },
    });
    $.export("$summary", `Successfully performed lookup for domain ${this.domainName}`);
    return response;
  },
};
