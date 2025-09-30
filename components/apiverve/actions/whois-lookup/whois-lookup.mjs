import apiverve from "../../apiverve.app.mjs";

export default {
  key: "apiverve-whois-lookup",
  name: "Whois Lookup",
  description: "Check the registration of a domain name. [See the documentation](https://docs.apiverve.com/api/whoislookup)",
  version: "0.0.2",
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
    const response = await this.apiverve.whoisLookup({
      $,
      params: {
        domain: this.domain,
      },
    });
    if (response?.status === "ok") {
      $.export("$summary", `Successfully retrieved WHOIS records for ${this.domain}`);
    }
    return response;
  },
};
