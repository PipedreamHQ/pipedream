import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-reverse-dns-lookup",
  name: "Reverse DNS Lookup",
  description: "Retrieve all the hostnames associated with any particular A, AAAA, MX, NS, SOA, SPF, TXT, and CNAME DNS records. For instance, you can access all the hostnames hosted on any IP/CIDR notation, all the domain names using Cloudflare name servers, and all the domain names using Google Mailbox [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    type: {
      type: "string",
      label: "Type",
      description: "The type of reverse DNS lookup to perform. Determines how the value parameter is interpreted: - A: IPv4 CIDR block - AAAA: IPv6 CIDR block - MX: Mail provider domain - NS: Name server provider hostname - SOA: SOA record admin domain - SPF/TXT: Target",
      optional: false,
      options: ["A","AAAA","MX","NS","SOA","SPF","TXT","CNAME"],
    },
    value: {
      type: "string",
      label: "Value",
      description: "Provide an IP or CIDR for A/AAAA lookups, or a hostname/selector for MX, NS, SOA, SPF, TXT, and CNAME queries. Wildcard regex patterns are also supported (e.g., mail.google.com, m*.google.com, _spf.g*.com, s*.g*.com).",
      optional: false,
    },
    exact: {
      type: "string",
      label: "Exact",
      description: "Accepts 'true' or 'false'. \"true\" returns only records that exactly match the input (NS, MX, CNAME, SOA, SPF, TXT). \"false\" returns all matches (default when omitted).",
      optional: true,
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/domain/dns/reverse",
      params: {
        type: this.type,
        value: this.value,
        exact: this.exact,
        page: this.page,
      },
    });
    $.export("$summary", "Successfully executed Reverse DNS Lookup");
    return response;
  },
};
