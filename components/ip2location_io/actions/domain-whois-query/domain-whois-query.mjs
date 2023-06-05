import ip2location from "../../ip2location_io.app.mjs";

export default {
  key: "ip2location_io-domain-whois-query",
  name: "Domain WHOIS query",
  description: "Retrieve domain information and WHOIS record for a domain name. [See the docs here](https://www.ip2location.io/ip2whois-documentation)",
  version: "0.0.1",
  type: "action",
  props: {
    ip2location,
    domain: {
      type: "string",
      label: "Domain",
      description: "Domain name to lookup",
    },
    format: {
      propDefinition: [
        ip2location,
        "format",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ip2location.domainWhoisQuery({
      params: {
        domain: this.domain,
        format: this.format,
      },
    });

    if (response) {
      $.export("$summary", `Successfully retrieved information about domain ${this.domain}.`);
    }

    return response;
  },
};
