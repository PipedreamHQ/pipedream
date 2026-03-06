// actions/get-geolocation/get-geolocation.mjs
import ipgeolocation_io from "../../ipgeolocation_io.app.mjs";

export default {
  key: "ipgeolocation_io-get-geolocation",
  name: "Get IP Geolocation",
  description:
    "Retrieve geolocation data for an IPv4/IPv6 address or domain name, including location, country metadata, timezone, currency, ASN, security insights and more. [See the documentation](https://ipgeolocation.io/documentation/ip-location-api.html)",
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
      label: "IP Address or Domain",
      description: "The IPv4/IPv6 address or domain name to look up. Leave blank to geolocate the caller's IP address",
      optional: true,
    },
    lang: {
      propDefinition: [
        ipgeolocation_io,
        "lang",
      ],
    },
    include: {
      type: "string",
      label: "Include Additional Data",
      description: "Comma-separated list of extra modules to include in the response. Available values: `geo_accuracy`, `dma_code`, `user_agent`, `security`, `abuse`, `hostname`, `liveHostname`, `hostnameFallbackLive`. Use `*` to include all. Only available on paid plans",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated list of fields to return (e.g. `location.city,currency,asn.organization`). Reduces response size. Available on all plans",
      optional: true,
    },
    excludes: {
      type: "string",
      label: "Exclude Fields",
      description: "Comma-separated list of fields or objects to exclude from the response (e.g. `currency,location.continent_code`). The `ip` field is always returned. Available on all plans",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ipgeolocation_io._makeRequest({
      path: "/ipgeo",
      params: {
        ip: this.ip,
        lang: this.lang,
        include: this.include,
        fields: this.fields,
        excludes: this.excludes,
      },
    });
    $.export("$summary", `Successfully retrieved geolocation data for ${this.ip || `caller's IP: ${response.ip}`}`);
    return response;
  },
};
