import { axios } from "@pipedream/platform";

export default {
  name: "WHOIS lookup",
  description: "Helps users to obtain domain information, WHOIS record, by using a domain name. Please refer to the [documentation](https://ip2whois.com/developers-api) for the details of the fields returned.",
  key: "ip2whois-query-domain-info",
  version: "0.0.1",
  type: "action",
  props: {
    ip2whois_api_key: {
      type: "app",
      app: "ip2whois",
      description: "WHOIS lookup API license key. You can sign up for a free license key at [here](https://ip2whois.com/register).",
    },
    domain: {
      type: "string",
      label: "Domain name",
      description: "Domain name.",
    },
    format: {
      type: "string",
      label: "Response Format",
      description: "Format of the response message. Available values are `json` or `xml`. If unspecified, json format will be used for the response message.",
      optional: true,
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: `https://api.ip2whois.com/v2/`,
      params: {
        key: `${this.ip2whois_api_key.$auth.api_key}`,
        format: (typeof this.format === "undefined") ? "json" :`${this.format}`,
        domain: `${this.domain}`,
      },
    })
  },
}