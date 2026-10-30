import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-domain-availability-suggestions",
  name: "Domain Availability With Suggestions",
  description: "The Domain Search API is designed to simplify the process of finding available domain names across all top-level domains (TLDs) and second-level domains (SLDs). [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    domain: {
      type: "string",
      label: "Domain",
      description: "Domain name for availability and suggestions.",
      optional: false,
    },
    source: {
      type: "string",
      label: "Source",
      description: "Specify the data source for domain availability checks. Use \"dns\" for DNS-based lookups or \"whois\" for WHOIS-based lookups. By default, \"dns\" is used.",
      optional: true,
      options: ["dns","whois"],
    },
    count: {
      type: "string",
      label: "Count",
      description: "Number of suggestions to retrieve.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/domain/availability/suggestions",
      params: {
        domain: this.domain,
        source: this.source,
        count: this.count,
      },
    });
    $.export("$summary", "Successfully executed Domain Availability With Suggestions");
    return response;
  },
};
