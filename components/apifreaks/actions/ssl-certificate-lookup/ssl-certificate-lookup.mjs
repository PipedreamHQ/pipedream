import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-ssl-certificate-lookup",
  name: "SSL Certificate Lookup",
  description: "Retrieve comprehensive SSL certificate information without the certificate chain. This endpoint provides detailed information about the SSL certificate including expiry dates, issuer details, and encryption methods. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    domainName: {
      type: "string",
      label: "Domainname",
      description: "Domain name or URL whose SSL certificate lookup is required",
      optional: false,
    },
    sslRaw: {
      type: "string",
      label: "Sslraw",
      description: "Set to true to get the raw openSSL response of the domain",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/domain/ssl/live",
      params: {
        domainName: this.domainName,
        sslRaw: this.sslRaw,
      },
    });
    $.export("$summary", "Successfully executed SSL Certificate Lookup");
    return response;
  },
};
