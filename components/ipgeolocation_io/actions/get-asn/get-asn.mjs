import ipgeolocation_io from "../../ipgeolocation_io.app.mjs";

export default {
  key: "ipgeolocation_io-get-asn",
  name: "Get ASN Details",
  description:
    "Retrieve detailed ASN information including peers, upstreams, downstreams, routes, and WHOIS data for an ASN number or IP address. Only available on paid plans. [See the documentation](https://ipgeolocation.io/documentation/asn-api.html)",
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
      description: "The IPv4/IPv6 address to look up. Leave blank to lookup ASN data for the caller's IP address",
      optional: true,
    },
    asn: {
      type: "string",
      label: "ASN",
      description: "The ASN number (e.g. `AS15169`). If both `ip` and `asn` are provided, `asn` will be used",
      optional: true,
    },
    include: {
      type: "string",
      label: "Include Additional Data",
      description: "Comma-separated list of extra modules to include in the response. Available values: `routes`, `peers`, `upstreams`, `downstreams`, `whois_response`. Use `*` to include all.",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated list of fields to return (e.g. `asn.organization,asn.routes`). Reduces response size",
      optional: true,
    },
    excludes: {
      type: "string",
      label: "Exclude Fields",
      description: "Comma-separated list of fields to exclude from the response. The `ip` field is always returned if querying by IP address",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ipgeolocation_io._makeRequest({
      path: "/asn",
      params: {
        asn: this.asn,
        ip: this.ip,
        include: this.include,
        fields: this.fields,
        excludes: this.excludes,
      },
    });
    $.export("$summary", `Successfully retrieved ASN details for ${this.asn || this.ip || `caller's IP: ${response.ip}`}`);
    return response;
  },
};
