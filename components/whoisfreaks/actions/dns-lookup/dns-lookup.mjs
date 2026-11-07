import whoisfreaks from "../../whoisfreaks.app.mjs";
import { parseObject } from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "whoisfreaks-dns-lookup",
  name: "DNS Lookup",
  description: "Retrieve live DNS records (A, AAAA, MX, NS, CNAME, SOA, TXT, SPF) for a single domain, or the PTR record for an IP address. Use this for real-time checks of one domain; use **Bulk DNS Domain Lookup** for up to 100 at once. [See the documentation](https://whoisfreaks.com/documentation/dns-checker-api#live-dns-lookup)",
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
      description: "The domain name to look up DNS records for (e.g. `example.com`). Provide this, an IP address, or both.",
      optional: true,
    },
    ipAddress: {
      type: "string",
      label: "IP Address",
      description: "An IPv4 or IPv6 address to look up the PTR (reverse DNS) record for (e.g. `8.8.8.8`). Provide this, a domain name, or both.",
      optional: true,
    },
    type: {
      propDefinition: [
        whoisfreaks,
        "recordTypes",
      ],
      options: [
        ...whoisfreaks.propDefinitions.recordTypes.options,
        "SPF",
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
    if (!this.domainName && !this.ipAddress) {
      throw new ConfigurationError("Please provide a domain name, an IP address, or both.");
    }

    const response = await this.whoisfreaks.lookupDns({
      $,
      params: {
        domainName: this.domainName,
        ipAddress: this.ipAddress,
        type: parseObject(this.type).join(","),
        format: this.format,
      },
    });
    $.export("$summary", `Successfully retrieved DNS records for ${this.domainName || this.ipAddress}`);
    return response;
  },
};
