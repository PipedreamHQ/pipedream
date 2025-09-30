import viewdnsInfo from "../../viewdns_info.app.mjs";

export default {
  key: "viewdns_info-reverse-whois-lookup",
  name: "Reverse Whois Lookup",
  description: "Performs a reverse WHOIS search to find domains registered by the same person or organization. [See the documentation](https://viewdns.info/api/reverse-whois-lookup/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    viewdnsInfo,
    q: {
      type: "string",
      label: "Query",
      description: "The registrant name or email address to search for (e.g., domain@example.com).",
    },
  },
  async run({ $ }) {
    const results = await this.viewdnsInfo.getPaginatedResources({
      fn: this.viewdnsInfo.reverseWhoisLookup,
      args: {
        $,
        params: {
          q: this.q,
        },
      },
      resourceKey: "matches",
    });

    $.export("$summary", `Found ${results.length} domain${results.length === 1
      ? ""
      : "s"} matching the query.`);

    return results;
  },
};
