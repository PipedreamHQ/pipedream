import whoisfreaks from "../../whoisfreaks.app.mjs";

export default {
  key: "whoisfreaks-dns-history-lookup",
  name: "DNS History Lookup",
  description: "Retrieve historical DNS records for a domain to see past IP addresses, nameservers, mail servers and other records, and when they changed. Results are paginated. [See the documentation](https://whoisfreaks.com/documentation/dns-checker-api)",
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
    type: {
      type: "string[]",
      label: "Record Types",
      description: "DNS record types to retrieve. Select `all` to return every type.",
      options: [
        "all",
        "A",
        "AAAA",
        "MX",
        "NS",
        "CNAME",
        "SOA",
        "TXT",
      ],
      default: [
        "all",
      ],
    },
    page: {
      propDefinition: [
        whoisfreaks,
        "page",
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
    const response = await this.whoisfreaks.lookupDnsHistory({
      $,
      params: {
        domainName: this.domainName,
        type: this.type.join(","),
        page: this.page || 1,
        format: this.format,
      },
    });
    $.export("$summary", `Successfully retrieved DNS history for domain ${this.domainName}`);
    return response;
  },
};
