import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-convert-timezone",
  name: "Convert Time Between Timezones",
  description: "Converts a given time from one timezone to another using various input types like timezone name, coordinates, location, or codes. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    time: {
      type: "string",
      label: "Time",
      description: "Time to convert in `yyyy-MM-dd HH:mm` or `yyyy-MM-dd HH:mm:ss` format.",
      optional: true,
    },
    tzFrom: {
      type: "string",
      label: "Tz From",
      description: "Source timezone name (e.g., `Asia/Kolkata`).",
      optional: true,
    },
    tzTo: {
      type: "string",
      label: "Tz To",
      description: "Target timezone name (e.g., `America/New_York`).",
      optional: true,
    },
    latFrom: {
      type: "string",
      label: "Lat From",
      description: "Latitude of source location.",
      optional: true,
    },
    longFrom: {
      type: "string",
      label: "Long From",
      description: "Longitude of source location.",
      optional: true,
    },
    latTo: {
      type: "string",
      label: "Lat To",
      description: "Latitude of target location.",
      optional: true,
    },
    longTo: {
      type: "string",
      label: "Long To",
      description: "Longitude of target location.",
      optional: true,
    },
    locationFrom: {
      type: "string",
      label: "Location From",
      description: "From location (city/country).",
      optional: true,
    },
    locationTo: {
      type: "string",
      label: "Location To",
      description: "To location (city/country).",
      optional: true,
    },
    iataFrom: {
      type: "string",
      label: "Iata From",
      description: "From IATA airport code (e.g., JFK).",
      optional: true,
    },
    iataTo: {
      type: "string",
      label: "Iata To",
      description: "To IATA airport code.",
      optional: true,
    },
    icaoFrom: {
      type: "string",
      label: "Icao From",
      description: "From ICAO airport code (e.g., KJFK).",
      optional: true,
    },
    icaoTo: {
      type: "string",
      label: "Icao To",
      description: "To ICAO airport code.",
      optional: true,
    },
    locodeFrom: {
      type: "string",
      label: "Locode From",
      description: "From UN/LO CODE.",
      optional: true,
    },
    locodeTo: {
      type: "string",
      label: "Locode To",
      description: "To UN/LO CODE.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/timezone/converter",
      params: {
        time: this.time,
        "tz_from": this.tzFrom,
        "tz_to": this.tzTo,
        "lat_from": this.latFrom,
        "long_from": this.longFrom,
        "lat_to": this.latTo,
        "long_to": this.longTo,
        "location_from": this.locationFrom,
        "location_to": this.locationTo,
        "iata_from": this.iataFrom,
        "iata_to": this.iataTo,
        "icao_from": this.icaoFrom,
        "icao_to": this.icaoTo,
        "locode_from": this.locodeFrom,
        "locode_to": this.locodeTo,
      },
    });
    $.export("$summary", "Successfully executed Convert Time Between Timezones");
    return response;
  },
};
