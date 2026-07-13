import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-geolocation-lookup",
  name: "IP Geolocation Lookup",
  description: "Get detailed IP geolocation data for an IP address including country, city, timezone, currency, and optional threat intelligence and user-agent information [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    ip: {
      type: "string",
      label: "Ip",
      description: "IPv4, IPv6, or hostname for geolocation lookup",
      optional: true,
    },
    lang: {
      type: "string",
      label: "Lang",
      description: "Response language for location fields",
      optional: true,
      options: ["en","de","ru","ja","fr","cn","es","cs","it"],
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma separated list of fields to include in response",
      optional: true,
    },
    excludes: {
      type: "string",
      label: "Excludes",
      description: "Comma separated list of fields to exclude from response",
      optional: true,
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
      path: "/v1.0/geolocation/lookup",
      params: {
        ip: this.ip,
        lang: this.lang,
        fields: this.fields,
        excludes: this.excludes,
        include: this.include,
      },
    });
    $.export("$summary", "Successfully executed IP Geolocation Lookup");
    return response;
  },
};
