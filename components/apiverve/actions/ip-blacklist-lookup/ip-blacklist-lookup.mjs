import apiverve from "../../apiverve.app.mjs";

export default {
  key: "apiverve-ip-blacklist-lookup",
  name: "IP Blacklist Lookup",
  description: "Lookup if an IP address is in a blacklist. [See the documentation](https://docs.apiverve.com/api/ipblacklistlookup)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    apiverve,
    ip: {
      type: "string",
      label: "IP Address",
      description: "The IP address to lookup in the blacklist (e.g., 201.23.192.173)",
    },
  },
  async run({ $ }) {
    const response = await this.apiverve.ipBlacklistLookup({
      $,
      params: {
        ip: this.ip,
      },
    });
    if (response?.status === "ok") {
      $.export("$summary", `Successfully retrieved data for ${this.ip}`);
    }
    return response;
  },
};
