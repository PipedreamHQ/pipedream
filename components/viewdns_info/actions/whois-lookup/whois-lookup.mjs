import viewdnsInfo from "../../viewdns_info.app.mjs";

export default {
  key: "viewdns_info-whois-lookup",
  name: "Whois Lookup",
  description: "Performs a WHOIS lookup to retrieve domain registration information. [See the documentation](https://viewdns.info/api/whois/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    viewdnsInfo,
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain or IP to perform a whois lookup on (e.g., example.com)",
    },
  },
  async run({ $ }) {
    const response = await this.viewdnsInfo.whoisLookup({
      $,
      params: {
        domain: this.domain,
      },
    });

    $.export("$summary", `Successfully retrieved WHOIS information for ${this.domain}`);

    return response;
  },
};
