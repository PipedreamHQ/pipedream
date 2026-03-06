import ipgeolocation_io from "../../ipgeolocation_io.app.mjs";

export default {
  key: "ipgeolocation_io-get-timezone",
  name: "Get Timezone",
  description:
    "Retrieve timezone information using a timezone name, IP address, coordinates, city, IATA code, ICAO code, or UN/LOCODE. [See the documentation](https://ipgeolocation.io/documentation/timezone-api.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ipgeolocation_io,
    tz: {
      type: "string",
      label: "Timezone Name",
      description: "IANA timezone name to look up (e.g. `America/New_York`).",
      optional: true,
    },
    ip: {
      type: "string",
      label: "IP Address",
      description: "IPv4 or IPv6 address to look up timezone for. Leave blank to lookup timezone for the caller's IP address if no other parameters are provided",
      optional: true,
    },
    lat: {
      type: "string",
      label: "Latitude",
      description: "Latitude coordinate (e.g. `40.7128`).",
      optional: true,
    },
    long: {
      type: "string",
      label: "Longitude",
      description: "Longitude coordinate (e.g. `-74.0060`).",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "City or physical address string (e.g. `New York, USA`)",
      optional: true,
    },
    iata: {
      type: "string",
      label: "IATA Code",
      description: "Airport IATA code (e.g. `JFK`)",
      optional: true,
    },
    icao: {
      type: "string",
      label: "ICAO Code",
      description: "Airport ICAO code (e.g. `KJFK`)",
      optional: true,
    },
    locode: {
      type: "string",
      label: "UN/LOCODE",
      description: "UN/LOCODE for a port or city (e.g. `USNYC`)",
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
      path: "/timezone",
      params: {
        tz: this.tz,
        ip: this.ip,
        lat: this.lat,
        long: this.long,
        location: this.location,
        iata_code: this.iata,
        icao_code: this.icao,
        lo_code: this.locode,
        lang: this.lang,
      },
    });
    const identifier = this.tz || ((this.lat != null && this.long != null)
      ? `${this.lat},${this.long}`
      : null ) || this.location || this.ip || this.iata || this.icao || this.locode || `caller's IP: ${response.ip}`;
    $.export("$summary", `Successfully retrieved timezone data for ${identifier}`);
    return response;
  },
};
