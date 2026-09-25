import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-whois-lookup-v2",
  name: "Domain WHOIS Lookup (V2.0)",
  description: "Retrieve current WHOIS information for a domain name. This endpoint provides detailed registration information including registrar details, dates, nameservers, and registrant information. - v2.0 response format. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    domainName: {
      type: "string",
      label: "Domainname",
      description: "Domain name for WHOIS lookup",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v2.0/domain/whois/live",
      params: {
        domainName: this.domainName,
      },
    });
    $.export("$summary", "Successfully executed Domain WHOIS Lookup (V2.0)");
    return response;
  },
};
