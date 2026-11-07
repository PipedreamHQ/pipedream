import whoisfreaks from "../../whoisfreaks.app.mjs";

export default {
  key: "whoisfreaks-reverse-dns-lookup",
  name: "Reverse DNS Lookup",
  description: "Find domains whose DNS records point to a given value, such as an IP address or CIDR range (A/AAAA), a mail server (MX) or a nameserver (NS). Use this to map shared hosting and infrastructure. Results are paginated. [See the documentation](https://whoisfreaks.com/documentation/dns-checker-api#reverse-dns-lookup)",
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
    value: {
      type: "string",
      label: "Value",
      description: "The DNS record value to search for, e.g. an IP address or CIDR range (`8.8.8.8`) for A/AAAA, or a server name (`ns1.example.com`) for MX or NS",
    },
    type: {
      type: "string",
      label: "Record Type",
      description: "The DNS record type to search in. One of `A`, `AAAA`, `MX`, `NS`, `CNAME`, `TXT`, `SOA`. e.g. `A`.",
      options: [
        "A",
        "AAAA",
        "MX",
        "NS",
        "CNAME",
        "TXT",
        "SOA",
      ],
      default: "A",
    },
    exact: {
      type: "boolean",
      label: "Exact Match",
      description: "Set to `false` to allow pattern matching with `*` wildcards for MX, NS, CNAME, TXT and SOA records",
      optional: true,
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
    try {
      const response = await this.whoisfreaks.lookupReverseDns({
        $,
        params: {
          value: this.value,
          type: this.type.toLowerCase(),
          exact: this.exact,
          page: this.page || 1,
          format: this.format,
        },
      });
      $.export("$summary", `Successfully performed reverse DNS lookup for ${this.value}`);
      return response;
    } catch (error) {
      // The reverse DNS endpoint returns 404 when no matching records exist.
      // Treat that as an empty result rather than a failed action.
      if (error.response?.status === 404) {
        $.export("$summary", `No domains found for ${this.value}`);
        return error.response?.data || {
          status: false,
          message: "No records found",
        };
      }
      throw error;
    }
  },
};
