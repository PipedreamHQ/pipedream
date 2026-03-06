import ipgeolocation_io from "../../ipgeolocation_io.app.mjs";

export default {
  key: "ipgeolocation_io-get-ip-security",
  name: "Get IP Security",
  description:
    "Retrieve real-time threat intelligence for an IPv4 or IPv6 address, including VPN, proxy, Tor, bot, spam detection, and a threat score. Only available on paid plans. [See the documentation](https://ipgeolocation.io/documentation/ip-security-api.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ipgeolocation_io,
    ip: {
      type: "string",
      label: "IP Address",
      description: "The IPv4/IPv6 address to look up. Leave blank to lookup security data for the caller's IP address",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated list of fields to return (e.g. `security.is_vpn,security.is_tor`). Reduces response size.",
      optional: true,
    },
    excludes: {
      type: "string",
      label: "Exclude Fields",
      description: "Comma-separated list of fields or objects to exclude from the response (e.g. `security.is_relay,security.is_anonymous,security.threat_score`). The `ip` field is always returned.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ipgeolocation_io._makeRequest({
      $,
      path: "/security",
      params: {
        ip: this.ip,
        fields: this.fields,
        excludes: this.excludes,
      },
    });
    $.export("$summary", `Successfully retrieved security data for ${this.ip || `caller's IP: ${response.ip}`}`);
    return response;
  },
};
