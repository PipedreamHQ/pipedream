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
      propDefinition: [
        app,
        "ip",
      ],
    },
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
    },
    excludes: {
      propDefinition: [
        app,
        "excludes",
      ],
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
