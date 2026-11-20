import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-domain-availability",
  name: "Check Domain Availability",
  description: "The Domain Search API is designed to simplify the process of finding available domain names across all top-level domains (TLDs) and second-level domains (SLDs). [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    domain: {
      type: "string",
      label: "Domain",
      description: "Domain name whose availability is to be checked.",
      optional: false,
    },
    source: {
      type: "string",
      label: "Source",
      description: "Specify the data source for domain availability checks. Use \"dns\" for DNS-based lookups or \"whois\" for WHOIS-based lookups. By default, \"dns\" is used.",
      optional: true,
      options: ["dns","whois"],
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/domain/availability",
      params: {
        domain: this.domain,
        source: this.source,
      },
    });
    $.export("$summary", "Successfully executed Check Domain Availability");
    return response;
  },
};
