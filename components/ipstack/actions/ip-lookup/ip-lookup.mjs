import app from "../../ipstack.app.mjs";

export default {
  key: "ipstack-ip-lookup",
  name: "IP Lookup",
  description: "Look up single IPv4 or IPv6 addresses. [See the documentation](https://ipstack.com/documentation#standard)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    ip: {
      propDefinition: [
        app,
        "ip",
      ],
    },
    hostname: {
      propDefinition: [
        app,
        "hostname",
      ],
    },
    security: {
      propDefinition: [
        app,
        "security",
      ],
    },
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.ipLookup({
      $,
      ip: this.ip,
      params: {
        hostname: this.hostname
          ? 1
          : 0,
        security: this.security
          ? 1
          : 0,
        language: this.language,
      },
    });
    $.export("$summary", "Successfully retrieved data for the IP " + this.ip);
    return response;
  },
};
