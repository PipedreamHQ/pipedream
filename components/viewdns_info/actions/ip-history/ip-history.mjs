import viewdnsInfo from "../../viewdns_info.app.mjs";

export default {
  key: "viewdns_info-ip-history",
  name: "IP History",
  description: "Retrieves the IP address history for a domain. [See the documentation](https://viewdns.info/api/ip-history/)",
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
      description: "The domain name to retrieve the historical IP addresses for (e.g., example.com).",
    },
  },
  async run({ $ }) {
    const response = await this.viewdnsInfo.ipHistory({
      $,
      params: {
        domain: this.domain,
      },
    });

    $.export("$summary", `Retrieved IP history for ${this.domain}.`);

    return response;
  },
};
