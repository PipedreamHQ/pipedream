import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-post-domain-whois-live-v2",
  name: "Bulk Domain WHOIS Lookup (V2.0)",
  description: "Retrieve WHOIS information for `100 Domains per Request`. - v2.0 response format. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    domainNames: {
      type: "string",
      label: "Domainnames",
      description: "A list of domain names for which WHOIS data is requested.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v2.0/domain/whois/live",
      data: {
        domainNames: this.domainNames,
      },
    });
    $.export("$summary", "Successfully executed Bulk Domain WHOIS Lookup (V2.0)");
    return response;
  },
};
