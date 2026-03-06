import ipgeolocation from "../../ipgeolocation.app.mjs";

export default {
  key: "ipgeolocation-convert-timezone",
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
    ipgeolocation,
    tzFrom: {
      type: "string",
      label: "From Timezone",
      description: "Source timezone name (e.g. `America/New_York`). Must be used with `To Timezone`",
      optional: true,
    },
    tzTo: {
      type: "string",
      label: "To Timezone",
      description: "Target timezone name (e.g. `Asia/Tokyo`). Must be used with `From Timezone`",
      optional: true,
    },
    latFrom: {
      type: "string",
      label: "From Latitude",
      description: "Source latitude coordinate. Must be used with From Longitude",
      optional: true,
    },
    longFrom: {
      type: "string",
      label: "From Longitude",
      description: "Source longitude coordinate. Must be used with From Latitude",
      optional: true,
    },
    latTo: {
      type: "string",
      label: "To Latitude",
      description: "Target latitude coordinate. Must be used with To Longitude",
      optional: true,
    },
    longTo: {
      type: "string",
      label: "To Longitude",
      description: "Target longitude coordinate. Must be used with To Latitude",
      optional: true,
    },
    locationFrom: {
      type: "string",
      label: "From Location",
      description: "Source city or address (e.g. `New York, USA`). Must be used with To Location",
      optional: true,
    },
    locationTo: {
      type: "string",
      label: "To Location",
      description: "Target city or address (e.g. `London, UK`). Must be used with From Location",
      optional: true,
    },
    iataFrom: {
      type: "string",
      label: "From IATA Code",
      description: "Source airport IATA code (e.g. `JFK`). Must be used with To IATA Code",
      optional: true,
    },
    iataTo: {
      type: "string",
      label: "To IATA Code",
      description: "Target airport IATA code (e.g. `LHR`). Must be used with From IATA Code",
      optional: true,
    },
    icaoFrom: {
      type: "string",
      label: "From ICAO Code",
      description: "Source airport ICAO code (e.g. `KJFK`). Must be used with To ICAO Code",
      optional: true,
    },
    icaoTo: {
      type: "string",
      label: "To ICAO Code",
      description: "Target airport ICAO code (e.g. `EGLL`). Must be used with From ICAO Code",
      optional: true,
    },
    locodeFrom: {
      type: "string",
      label: "From UN/LOCODE",
      description: "Source UN/LOCODE (e.g. `USNYC`). Must be used with To UN/LOCODE",
      optional: true,
    },
    locodeTo: {
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
      this.latFrom,
      this.longFrom,
      this.latTo,
      this.longTo,
    ].some(hasValue);
    const hasFullCoordSet = [
      this.latFrom,
      this.longFrom,
      this.latTo,
      this.longTo,
    ].every(hasValue);

    if (
      (hasValue(this.tzFrom) !== hasValue(this.tzTo))
      || (hasValue(this.locationFrom) !== hasValue(this.locationTo))
      || (hasValue(this.iataFrom) !== hasValue(this.iataTo))
      || (hasValue(this.icaoFrom) !== hasValue(this.icaoTo))
      || (hasValue(this.locodeFrom) !== hasValue(this.locodeTo))
      || (hasAnyCoord && !hasFullCoordSet)
    ) {
      throw new Error("Provide complete source and target values for the selected conversion mode.");
    }

    if (!(
      hasPair(this.tzFrom, this.tzTo)
      || hasPair(this.locationFrom, this.locationTo)
      || hasPair(this.iataFrom, this.iataTo)
      || hasPair(this.icaoFrom, this.icaoTo)
      || hasPair(this.locodeFrom, this.locodeTo)
      || hasFullCoordSet
    )) {
      throw new Error("Provide a valid source and target using timezone names, coordinates, locations, IATA, ICAO, or UN/LOCODE.");
    }

    const response = await this.ipgeolocation.convertTimezone({
      $,
      params: {
        tz_from: this.tzFrom,
        tz_to: this.tzTo,
        time: this.time,
        lat_from: this.latFrom,
        long_from: this.longFrom,
        lat_to: this.latTo,
        long_to: this.longTo,
        location_from: this.locationFrom,
        location_to: this.locationTo,
        iata_from: this.iataFrom,
        iata_to: this.iataTo,
        icao_from: this.icaoFrom,
        icao_to: this.icaoTo,
        locode_from: this.locodeFrom,
        locode_to: this.locodeTo,
      },
    });

    let from, to;

    if (hasPair(this.tzFrom, this.tzTo)) {
      from = this.tzFrom;
      to = this.tzTo;
    } else if (hasFullCoordSet) {
      from = `${this.latFrom},${this.longFrom}`;
      to = `${this.latTo},${this.longTo}`;
    } else if (hasPair(this.locationFrom, this.locationTo)) {
      from = this.locationFrom;
      to = this.locationTo;
    } else if (hasPair(this.iataFrom, this.iataTo)) {
      from = this.iataFrom;
      to = this.iataTo;
    } else if (hasPair(this.icaoFrom, this.icaoTo)) {
      from = this.icaoFrom;
      to = this.icaoTo;
    } else {
      from = this.locodeFrom;
      to = this.locodeTo;
    }

    $.export("$summary", `Successfully converted time from ${from} to ${to}`);
    return response;
  },
};
