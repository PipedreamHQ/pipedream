import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-geolocation-lookup-v2",
  name: "IP Geolocation Lookup (V2.0)",
  description: "Get detailed IP geolocation data for an IP address including country, city, timezone, currency, and optional threat intelligence and user-agent information - v2.0 response format. [See the documentation](https://apifreaks.com/docs).",
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
    lang: {
      type: "string",
      label: "Lang",
      description: "Response language for location fields",
      optional: true,
      options: ["en","de","ru","ja","fr","cn","es","cs","it","ko","fa","pt"],
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
    include: {
      type: "string",
      label: "Include",
      description: "Additional data to include (location, network, security, currency, time_zone, user_agent, country_metadata , hostname, liveHostname, hostnameFallbackLivet)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v2.0/geolocation/lookup",
      params: {
        ip: this.ip,
        lang: this.lang,
        fields: this.fields,
        excludes: this.excludes,
        include: this.include,
      },
    });
    $.export("$summary", "Successfully executed IP Geolocation Lookup (V2.0)");
    return response;
  },
};
