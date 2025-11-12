import apiverve from "../../apiverve.app.mjs";

export default {
  key: "apiverve-dns-lookup",
  name: "DNS Lookup",
  description: "Look up the DNS records of a domain. [See the documentation](https://docs.apiverve.com/api/dnslookup)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    apiverve,
    domain: {
      propDefinition: [
        apiverve,
        "domain",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.apiverve.dnsLookup({
      $,
      params: {
        domain: this.domain,
      },
    });
    if (response?.status === "ok") {
      $.export("$summary", `Successfully retrieved DNS records for ${this.domain}`);
    }
    return response;
  },
};
