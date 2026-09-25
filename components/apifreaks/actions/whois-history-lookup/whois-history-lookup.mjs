import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-whois-history-lookup",
  name: "WHOIS History Lookup",
  description: "Retrieve historical WHOIS records for a domain name. This endpoint provides a timeline of all recorded changes in domain registration information. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    domainName: {
      type: "string",
      label: "Domainname",
      description: "Domain name for historical WHOIS lookup",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/domain/whois/history",
      params: {
        domainName: this.domainName,
      },
    });
    $.export("$summary", "Successfully executed WHOIS History Lookup");
    return response;
  },
};
