import whoisfreaks from "../../whoisfreaks.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "whoisfreaks-dns-history-lookup",
  name: "DNS History Lookup",
  description: "Retrieve historical DNS records for a domain to see past IP addresses, nameservers, mail servers and other records, and when they changed. Results are paginated. [See the documentation](https://whoisfreaks.com/documentation/dns-checker-api#historical-dns-lookup)",
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
      propDefinition: [
        whoisfreaks,
        "recordTypes",
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
    // parseObject normalises JSON-encoded and comma-separated input, but a
    // JSON-encoded scalar comes back unchanged, so guard the join.
    const recordTypes = parseObject(this.type) ?? [];
    const response = await this.whoisfreaks.lookupDnsHistory({
      $,
      params: {
        domainName: this.domainName,
        type: (Array.isArray(recordTypes) ? recordTypes : [ recordTypes ]).join(","),
        page: this.page || 1,
        format: this.format,
      },
    });
    $.export("$summary", `Successfully retrieved DNS history for domain ${this.domainName}`);
    return response;
  },
};
