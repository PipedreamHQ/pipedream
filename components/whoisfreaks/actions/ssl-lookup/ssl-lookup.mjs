import whoisfreaks from "../../whoisfreaks.app.mjs";

export default {
  key: "whoisfreaks-ssl-lookup",
  name: "SSL Lookup",
  description:
    "Retrieve details about a domain's SSL certificate (e.g. google.com). Note that this action accepts JSON or XML format values, always requests the full certificate chain (chain=true), and suppresses the raw OpenSSL response (sslRaw=false) for cleaner outputs. [See the documentation](https://whoisfreaks.com/documentation/ssl-certificate-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    whoisfreaks,
    domainName: {
      propDefinition: [
        whoisfreaks,
        "domainName",
      ],
    },
    format: {
      propDefinition: [
        whoisfreaks,
        "format",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.whoisfreaks.lookupSsl({
      $,
      params: {
        domainName: this.domainName,
        format: this.format,
        chain: true,
        sslRaw: false,
      },
    });
    $.export(
      "$summary",
      `Successfully performed SSL lookup for ${this.domainName}`,
    );
    return response;
  },
};
