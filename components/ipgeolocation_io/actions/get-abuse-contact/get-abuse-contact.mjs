import ipgeolocation_io from "../../ipgeolocation_io.app.mjs";

export default {
  key: "ipgeolocation_io-get-abuse-contact",
  name: "Get Abuse Contact",
  description:
    "Retrieve abuse contact information for an IPv4 or IPv6 address, including abuse emails, phone numbers, organization, and network route. Only available on paid plans. [See the documentation](https://ipgeolocation.io/documentation/ip-abuse-contact-api.html)",
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
      description: "The IPv4 or IPv6 address to retrieve abuse contact information for. Leave blank to retrieve abuse contact information for the caller's IP address",
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated list of fields to return (e.g. `abuse.emails,abuse.organization`). Reduces response size",
      optional: true,
    },
    excludes: {
      type: "string",
      label: "Exclude Fields",
      description: "Comma-separated list of fields to exclude from the response. The `ip` field is always returned",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ipgeolocation_io._makeRequest({
      path: "/abuse",
      params: {
        ip: this.ip,
        fields: this.fields,
        excludes: this.excludes,
      },
    });
    $.export("$summary", `Successfully retrieved abuse contact for ${this.ip || `caller's IP: ${response.ip}`}`);
    return response;
  },
};
