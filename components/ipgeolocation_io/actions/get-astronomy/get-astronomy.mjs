import ipgeolocation_io from "../../ipgeolocation_io.app.mjs";

export default {
  key: "ipgeolocation_io-get-astronomy",
  name: "Get Astronomy Data",
  description:
    "Retrieve sunrise, sunset, moonrise, moonset, moon phase, and sun/moon position data for a location by IP address, coordinates, or location string. [See the documentation](https://ipgeolocation.io/documentation/astronomy-api.html)",
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
      description: "IPv4 or IPv6 address to look up astronomy data for. Leave all fields blank to use the caller's IP",
      optional: true,
    },
    lat: {
      type: "string",
      label: "Latitude",
      description: "Latitude coordinate (e.g. `40.7128`). Must be used together with Longitude",
      optional: true,
    },
    long: {
      type: "string",
      label: "Longitude",
      description: "Longitude coordinate (e.g. `-74.0060`). Must be used together with Latitude",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "City or physical address string (e.g. `New York, USA`)",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "IANA timezone name to look up (e.g. `America/New_York`).",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Date to get astronomy data for in `YYYY-MM-DD` format. Defaults to today",
      optional: true,
    },
    lang: {
      propDefinition: [
        ipgeolocation_io,
        "lang",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ipgeolocation_io._makeRequest({
      $,
      path: "/astronomy",
      params: {
        ip: this.ip,
        lat: this.lat,
        long: this.long,
        location: this.location,
        time_zone: this.timezone,
        date: this.date,
        lang: this.lang,
      },
    });
    const identifier =  ((this.lat && this.long)
      ? `${this.lat},${this.long}`
      : null) || this.location || this.timezone || this.ip || `caller's IP: ${response.ip}`;
    $.export("$summary", `Successfully retrieved astronomy data for ${identifier}`);
    return response;
  },
};
