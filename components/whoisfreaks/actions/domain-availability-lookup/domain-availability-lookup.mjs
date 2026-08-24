// x-pd-ai: optimized
import whoisfreaks from "../../whoisfreaks.app.mjs";

export default {
  key: "whoisfreaks-domain-availability-lookup",
  name: "Domain Availability Lookup",
  description:
    "Check if a domain name is available for registration. For example you can check whoisfreaks.com. This action supports responses in both JSON and XML format. Always use sug=false to get the response. [See the documentation](https://whoisfreaks.com/documentation/domain-availability-api#lookup)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
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
    const response = await this.whoisfreaks.lookupDomainAvailability({
      $,
      params: {
        domain: this.domainName,
        format: this.format,
        sug: false,
      },
    });
    $.export("$summary", `Successfully performed domain availability lookup for ${this.domainName}`);
    return response;
  },
};
