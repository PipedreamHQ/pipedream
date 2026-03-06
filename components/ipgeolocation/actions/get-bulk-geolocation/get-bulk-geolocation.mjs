import ipgeolocation_io from "../../ipgeolocation.app.mjs";

export default {
  key: "ipgeolocation-get-bulk-geolocation",
  name: "Get Bulk IP Geolocation",
  description:
    "Retrieve geolocation data for multiple IPv4/IPv6 addresses or domain names in a single request. Maximum 50,000 IPs per request. Only available on paid plans. [See the documentation](https://ipgeolocation.io/documentation/ip-location-api.html#bulk-ip-geolocation-lookup-api)",
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
      label: "IP Addresses or Domains",
      description:
        "List of IPv4/IPv6 addresses or domain names to look up. Maximum 50,000 per request",
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
      description:
        "Comma-separated list of extra modules to include in the response. Available values: `geo_accuracy`, `dma_code`, `user_agent`, `security`, `abuse`, `hostname`, `liveHostname`, `hostnameFallbackLive`. Use `*` to include all. Only available on paid plans",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description:
        "Comma-separated list of fields to return (e.g. `location.city,currency,asn.organization`). Reduces response size. Available on all plans",
      optional: true,
    },
    excludes: {
      type: "string",
      label: "Exclude Fields",
      description:
        "Comma-separated list of fields or objects to exclude from the response (e.g. `currency,location.continent_code`). The `ip` field is always returned. Available on all plans",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ipgeolocation_io._makeRequest({
      $,
      method: "POST",
      path: "/ipgeo-bulk",
      params: {
        lang: this.lang,
        include: this.include,
        fields: this.fields,
        excludes: this.excludes,
      },
      data: {
        ips: this.ips,
      },
    });
    $.export(
      "$summary",
      `Successfully retrieved geolocation data for ${
        this.ips.length
      } IP address${this.ips.length === 1
        ? ""
        : "es"}`,
    );
    return response;
  },
};
