import ip2location from "../../ip2location_io.app.mjs";

export default {
  key: "ip2location_io-lookup-hosted-domain",
  name: "Lookup Hosted Domain",
  description: "Retrieve the list of hosted domains on an IP Address. [See the docs here](https://www.ip2location.io/ip2whois-domains-documentation)",
  version: "0.0.1",
  type: "action",
  props: {
    ip2location,
    ip: {
      type: "string",
      label: "IP Address",
      description: "IP address (IPv4 or IPv6) to lookup",
    },
    format: {
      propDefinition: [
        ip2location,
        "format",
      ],
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Pagination result returns of the hosted domains. If unspecified, 1st page will be used.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ip2location.lookupHostedDomain({
      params: {
        ip: this.ip,
        format: this.format,
        page: this.page,
      },
    });

    if (response) {
      $.export("$summary", `Successfully retrieved hosted domains about IP ${this.ip}.`);
    }

    return response;
  },
};