import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-ip-security",
  name: "Retrieve Security Information for an IP Address",
  description: "Get comprehensive security information for a given IP address. Detects VPNs, proxies, Tor nodes, and other security threats. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    ip: {
      type: "string",
      label: "Ip",
      description: "A valid IPv4 or IPv6 address to look up. If omitted, the API uses the public IP of the requesting client.",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated list of fields to return. Supports dot notation (e.g. security.threat_score).",
      optional: true,
    },
    excludes: {
      type: "string",
      label: "Excludes",
      description: "Comma-separated list of fields to remove from the response. Supports dot notation (e.g. security.is_tor).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/ip/security",
      params: {
        ip: this.ip,
        fields: this.fields,
        excludes: this.excludes,
      },
    });
    $.export("$summary", "Successfully executed Retrieve Security Information for an IP Address");
    return response;
  },
};
