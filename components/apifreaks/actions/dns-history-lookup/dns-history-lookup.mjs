import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-dns-history-lookup",
  name: "DNS History Lookup",
  description: "Retrieve historical DNS records for any hostname. Access unique historical data for A, AAAA, MX, NS, SOA, SPF, TXT, and CNAME records, including subdomains. Results are paginated with up to 100 unique records per page. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    hostName: {
      type: "string",
      label: "Host Name",
      description: "Hostname or URL whose historical DNS records are required",
      optional: false,
    },
    type: {
      type: "string",
      label: "Type",
      description: "A comma-separated list of DNS record types for lookup. Possible values: A, AAAA, MX, NS, SOA, SPF, TXT, CNAME, or all",
      optional: false,
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
      path: "/v1.0/domain/dns/history",
      params: {
        "host-name": this.hostName,
        type: this.type,
        page: this.page,
      },
    });
    $.export("$summary", "Successfully executed DNS History Lookup");
    return response;
  },
};
