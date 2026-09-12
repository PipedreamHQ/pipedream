import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-dns-lookup",
  name: "DNS Lookup",
  description: "Retrieve real-time DNS records for any hostname. Supports multiple record types including A, AAAA, MX, NS, SOA, SPF, TXT, and CNAME records. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    hostName: {
      type: "string",
      label: "Host Name",
      description: "Hostname or URL whose DNS records are required.",
      optional: true,
    },
    ipAddress: {
      type: "string",
      label: "Ipaddress",
      description: "The IP address for requested DNS's PTR record. 'type' parameter must be set to 'all'.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "A comma-separated list of DNS record types for lookup. Possible values: A, AAAA, MX, NS, SOA, SPF, TXT, CNAME, or all. When ipAddress is provided, type must be \"all\".",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/domain/dns/live",
      params: {
        "host-name": this.hostName,
        ipAddress: this.ipAddress,
        type: this.type,
      },
    });
    $.export("$summary", "Successfully executed DNS Lookup");
    return response;
  },
};
