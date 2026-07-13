import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-post-domain-availability",
  name: "Bulk Domain Availability Check",
  description: "Perform Bulk Domain Availability checks using a list of domains. Supports upto `100 Domains Per Request`. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    source: {
      type: "string",
      label: "Source",
      description: "Specify the data source for domain availability checks. Use \"dns\" for DNS-based lookups or \"whois\" for WHOIS-based lookups. By default, \"dns\" is used.",
      optional: true,
      options: ["dns","whois"],
    },
    domainNames: {
      type: "string",
      label: "Domainnames",
      description: "List of domain names to check.",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v1.0/domain/availability",
      params: {
        source: this.source,
      },
      data: {
        domainNames: this.domainNames,
      },
    });
    $.export("$summary", "Successfully executed Bulk Domain Availability Check");
    return response;
  },
};
