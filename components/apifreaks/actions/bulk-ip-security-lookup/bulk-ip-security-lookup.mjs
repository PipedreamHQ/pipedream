import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-bulk-ip-security-lookup",
  name: "Bulk IP Security Lookup",
  description: "The Bulk IP Security Lookup API allows you to retrieve security details for up to `50,000` IP-addresses in a single request. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
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
    ips: {
      type: "string",
      label: "Ips",
      description: "List of IP addresses to lookup",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v1.0/ip/security",
      params: {
        fields: this.fields,
        excludes: this.excludes,
      },
      data: {
        ips: this.ips,
      },
    });
    $.export("$summary", "Successfully executed Bulk IP Security Lookup");
    return response;
  },
};
