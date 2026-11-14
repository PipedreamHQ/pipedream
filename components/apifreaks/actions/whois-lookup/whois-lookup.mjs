import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-whois-lookup",
  name: "Domain WHOIS Lookup",
  description: "Retrieve current WHOIS information for a domain name. This endpoint provides detailed registration information including registrar details, dates, nameservers, and registrant information. [See the documentation](https://apifreaks.com/docs).",
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
      path: "/v1.0/domain/whois/live",
      params: {
        domainName: this.domainName,
      },
    });
    $.export("$summary", "Successfully executed Domain WHOIS Lookup");
    return response;
  },
};
