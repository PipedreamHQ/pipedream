import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-ssl-certificate-chain-lookup",
  name: "SSL Certificate Chain Lookup",
  description: "Retrieve the complete SSL certificate chain from root Certificate Authority (CA) to end-user certificate. This endpoint provides comprehensive information about each certificate in the chain. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    domainName: {
      type: "string",
      label: "Domainname",
      description: "Domain name or URL whose SSL certificate chain lookup is required",
      optional: false,
    },
    sslRaw: {
      type: "string",
      label: "Sslraw",
      description: "Set to true to get the raw openSSL response for each certificate in the chain",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/domain/ssl/live/chain",
      params: {
        domainName: this.domainName,
        sslRaw: this.sslRaw,
      },
    });
    $.export("$summary", "Successfully executed SSL Certificate Chain Lookup");
    return response;
  },
};
