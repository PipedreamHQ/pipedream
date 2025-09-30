import ip2whoisApp from "../../ip2whois.app.mjs";

export default {
  name: "WHOIS lookup",
  description: "Helps users to obtain domain information, WHOIS record, by using a domain name. Please refer to the [documentation](https://ip2whois.com/developers-api) for the details of the fields returned.",
  key: "ip2whois-query-domain-info",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ip2whoisApp,
    domain: {
      type: "string",
      label: "Domain name",
    },
    format: {
      type: "string",
      label: "Response Format",
      description: "Format of the response message. If unspecified, `json` format will be used for the response message.",
      optional: true,
      options: [
        "json",
        "xml",
      ],
      default: "json",
    },
  },
  async run({ $ }) {
    const response =
      await this.ip2whoisApp.queryDomainInfo({
        $,
        params: {
          format: this.format ?? "json",
          domain: this.domain,
        },
      });
    $.export("$summary", "Successfully queried domain information.");
    return response;
  },
};
