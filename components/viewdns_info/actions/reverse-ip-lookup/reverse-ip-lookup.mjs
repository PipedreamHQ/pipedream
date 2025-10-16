import viewdnsInfo from "../../viewdns_info.app.mjs";

export default {
  key: "viewdns_info-reverse-ip-lookup",
  name: "Reverse IP Lookup",
  description: "Performs a reverse IP lookup to find domains hosted on the same IP address. [See the documentation](https://viewdns.info/api/reverse-ip-lookup/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    viewdnsInfo,
    host: {
      type: "string",
      label: "Host",
      description: "The domain or IP to perform the reverse IP lookup on (e.g., example.com)",
    },
  },
  async run({ $ }) {
    const results = await this.viewdnsInfo.getPaginatedResources({
      fn: this.viewdnsInfo.reverseIpLookup,
      args: {
        $,
        params: {
          host: this.host,
        },
      },
      resourceKey: "domains",
    });

    $.export("$summary", `Found ${results.length} domain${results.length === 1
      ? ""
      : "s"} hosted on the IP address.`);

    return results;
  },
};
