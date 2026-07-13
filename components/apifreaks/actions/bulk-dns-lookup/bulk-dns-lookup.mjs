import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-bulk-dns-lookup",
  name: "Bulk DNS Lookup",
  description: "Perform DNS lookups for multiple hostnames in a single request. Supports up to \`100 host-names per request\` and returns DNS records including A, AAAA, MX, NS, SOA, SPF, TXT, and CNAME records. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    type: {
      type: "string",
      label: "Type",
      description: "A comma-separated list of DNS record types for lookup. Possible values: A, AAAA, MX, NS, SOA, SPF, TXT, CNAME, or all",
      optional: false,
    },
    domainNames: {
      type: "string",
      label: "Domainnames",
      description: "List of hostnames to lookup DNS records for",
      optional: false,
    },
    ipAddresses: {
      type: "string",
      label: "Ipaddresses",
      description: "Array of IP addresses to include in the lookup for enrichment",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v1.0/domain/dns/live",
      params: {
        type: this.type,
      },
      data: {
        domainNames: this.domainNames,
        ipAddresses: this.ipAddresses,
      },
    });
    $.export("$summary", "Successfully executed Bulk DNS Lookup");
    return response;
  },
};
