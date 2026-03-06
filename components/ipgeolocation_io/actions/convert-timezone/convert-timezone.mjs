import ipgeolocation_io from "../../ipgeolocation_io.app.mjs";

export default {
  key: "ipgeolocation_io-convert-timezone",
  name: "Convert Timezone",
  description:
    "Convert a time between two timezones using timezone names, coordinates, city, IATA, ICAO, or UN/LOCODE. [See the documentation](https://ipgeolocation.io/documentation/timezone-api.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ipgeolocation_io,
    tz_from: {
      type: "string",
      label: "From Timezone",
      description: "Source timezone name (e.g. `America/New_York`). Must be used with `To Timezone`",
      optional: true,
    },
    tz_to: {
      type: "string",
      label: "To Timezone",
      description: "Target timezone name (e.g. `Asia/Tokyo`). Must be used with `From Timezone`",
      optional: true,
    },
    lat_from: {
      type: "string",
      label: "From Latitude",
      description: "Source latitude coordinate. Must be used with From Longitude",
      optional: true,
    },
    long_from: {
      type: "string",
      label: "From Longitude",
      description: "Source longitude coordinate. Must be used with From Latitude",
      optional: true,
    },
    lat_to: {
      type: "string",
      label: "To Latitude",
      description: "Target latitude coordinate. Must be used with To Longitude",
      optional: true,
    },
    long_to: {
      type: "string",
      label: "To Longitude",
      description: "Target longitude coordinate. Must be used with To Latitude",
      optional: true,
    },
    location_from: {
      type: "string",
      label: "From Location",
      description: "Source city or address (e.g. `New York, USA`). Must be used with To Location",
      optional: true,
    },
    location_to: {
      type: "string",
      label: "To Location",
      description: "Target city or address (e.g. `London, UK`). Must be used with From Location",
      optional: true,
    },
    iata_from: {
      type: "string",
      label: "From IATA Code",
      description: "Source airport IATA code (e.g. `JFK`). Must be used with To IATA Code",
      optional: true,
    },
    iata_to: {
      type: "string",
      label: "To IATA Code",
      description: "Target airport IATA code (e.g. `LHR`). Must be used with From IATA Code",
      optional: true,
    },
    icao_from: {
      type: "string",
      label: "From ICAO Code",
      description: "Source airport ICAO code (e.g. `KJFK`). Must be used with To ICAO Code",
      optional: true,
    },
    icao_to: {
      type: "string",
      label: "To ICAO Code",
      description: "Target airport ICAO code (e.g. `EGLL`). Must be used with From ICAO Code",
      optional: true,
    },
    locode_from: {
      type: "string",
      label: "From UN/LOCODE",
      description: "Source UN/LOCODE (e.g. `USNYC`). Must be used with To UN/LOCODE",
      optional: true,
    },
    locode_to: {
      type: "string",
      label: "To UN/LOCODE",
      description: "Target UN/LOCODE (e.g. `GBLON`). Must be used with From UN/LOCODE",
      optional: true,
    },
    time: {
      type: "string",
      label: "Time to Convert",
      description: "Time to convert in format `YYYY-MM-DD HH:mm` or `YYYY-MM-DD HH:mm:ss`. Leave blank to convert current time",
      optional: true,
    },
  },
  async run({ $ }) {
    const hasValue = (value) => value !== undefined && value !== null && value !== "";
    const hasPair = (from, to) => hasValue(from) && hasValue(to);
    const hasAnyCoord = [
      this.lat_from,
      this.long_from,
      this.lat_to,
      this.long_to,
    ].some(hasValue);
    const hasFullCoordSet = [
      this.lat_from,
      this.long_from,
      this.lat_to,
      this.long_to,
    ].every(hasValue);

    if (
      (hasValue(this.tz_from) !== hasValue(this.tz_to))
      || (hasValue(this.location_from) !== hasValue(this.location_to))
      || (hasValue(this.iata_from) !== hasValue(this.iata_to))
      || (hasValue(this.icao_from) !== hasValue(this.icao_to))
      || (hasValue(this.locode_from) !== hasValue(this.locode_to))
      || (hasAnyCoord && !hasFullCoordSet)
    ) {
      throw new Error("Provide complete source and target values for the selected conversion mode.");
    }

    if (!(
      hasPair(this.tz_from, this.tz_to)
      || hasPair(this.location_from, this.location_to)
      || hasPair(this.iata_from, this.iata_to)
      || hasPair(this.icao_from, this.icao_to)
      || hasPair(this.locode_from, this.locode_to)
      || hasFullCoordSet
    )) {
      throw new Error("Provide a valid source and target using timezone names, coordinates, locations, IATA, ICAO, or UN/LOCODE.");
    }

    const response = await this.ipgeolocation_io._makeRequest({
      path: "/timezone/convert",
      params: {
        tz_from: this.tz_from,
        tz_to: this.tz_to,
        time: this.time,
        lat_from: this.lat_from,
        long_from: this.long_from,
        lat_to: this.lat_to,
        long_to: this.long_to,
        location_from: this.location_from,
        location_to: this.location_to,
        iata_from: this.iata_from,
        iata_to: this.iata_to,
        icao_from: this.icao_from,
        icao_to: this.icao_to,
        locode_from: this.locode_from,
        locode_to: this.locode_to,
      },
    });

    const from = this.tz_from || `${this.lat_from},${this.long_from}` || this.location_from || this.iata_from
      || this.icao_from || this.locode_from ;
    const to = this.tz_to || `${this.lat_to},${this.long_to}` || this.location_to || this.iata_to
      || this.icao_to || this.locode_to;

    $.export("$summary", `Successfully converted time from ${from} to ${to}`);
    return response;
  },
};
