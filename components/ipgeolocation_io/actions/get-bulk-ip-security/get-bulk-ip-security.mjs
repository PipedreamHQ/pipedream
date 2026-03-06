import ipgeolocation_io from "../../ipgeolocation_io.app.mjs";

export default {
  key: "ipgeolocation_io-get-bulk-ip-security",
  name: "Get Bulk IP Security",
  description:
    "Retrieve real-time threat intelligence for multiple IPv4 or IPv6 addresses in a single request, including VPN, proxy, Tor, bot, spam detection, and threat scores. Maximum 50,000 IPs per request. Only available on paid plans. [See the documentation](https://ipgeolocation.io/documentation/ip-security-api.html#bulk-ip-security-lookup-endpoint)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ipgeolocation_io,
    ips: {
      type: "string[]",
      label: "IP Addresses",
      description: "List of IPv4 or IPv6 addresses to look up. Maximum 50,000 per request",
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated list of fields to return (e.g. `security.is_vpn,security.threat_score`). Reduces response size",
      optional: true,
    },
    excludes: {
      type: "string",
      label: "Exclude Fields",
      description: "Comma-separated list of fields to exclude from the response (e.g. `security.is_relay,security.proxy_provider_names`). The `ip` field is always returned",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ipgeolocation_io._makeRequest({
      method: "POST",
      path: "/security-bulk",
      params: {
        fields: this.fields,
        excludes: this.excludes,
      },
      data: {
        ips: this.ips,
      },
    });
    $.export("$summary", `Successfully retrieved security data for ${this.ips.length} IP address${this.ips.length === 1
      ? ""
      : "es"}`);
    return response;
  },
};
