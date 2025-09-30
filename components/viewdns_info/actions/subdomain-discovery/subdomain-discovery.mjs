import viewdnsInfo from "../../viewdns_info.app.mjs";

export default {
  key: "viewdns_info-subdomain-discovery",
  name: "Subdomain Discovery",
  description: "Discovers subdomains associated with a given domain. [See the documentation](https://viewdns.info/api/subdomain-discovery/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    viewdnsInfo,
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain name to retrieve subdomains for (e.g., example.com).",
    },
  },
  async run({ $ }) {
    const results = await this.viewdnsInfo.getPaginatedResources({
      fn: this.viewdnsInfo.subdomainDiscovery,
      args: {
        $,
        params: {
          domain: this.domain,
        },
      },
      resourceKey: "subdomains",
    });

    $.export("$summary", `Found ${results.length} subdomain${results.length === 1
      ? ""
      : "s"} for ${this.domain}.`);

    return results;
  },
};
