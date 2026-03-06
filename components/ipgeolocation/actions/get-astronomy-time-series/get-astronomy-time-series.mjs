import ipgeolocation_io from "../../ipgeolocation.app.mjs";

export default {
  key: "ipgeolocation-get-astronomy-time-series",
  name: "Get Astronomy Time Series",
  description:
    "Retrieve astronomical data (sunrise, sunset, moonrise, moonset, moon phase, and more) for a date range up to 90 days for a location by IP address, coordinates, or address. [See the documentation](https://ipgeolocation.io/documentation/astronomy-api.html#time-series-lookup)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ipgeolocation_io,
    dateStart: {
      type: "string",
      label: "Start Date",
      description:
        "Start date of the time series in `YYYY-MM-DD` format. Maximum range is 90 days",
    },
    dateEnd: {
      type: "string",
      label: "End Date",
      description:
        "End date of the time series in `YYYY-MM-DD` format. Maximum range is 90 days from Start Date",
    },
    ip: {
      type: "string",
      label: "IP Address",
      description:
        "IPv4 or IPv6 address to look up astronomy data for. Leave all fields blank to use the caller's IP",
      optional: true,
    },
    lat: {
      type: "string",
      label: "Latitude",
      description:
        "Latitude coordinate (e.g. `40.7128`). Must be used together with Longitude. Takes priority over Location and IP",
      optional: true,
    },
    long: {
      type: "string",
      label: "Longitude",
      description:
        "Longitude coordinate (e.g. `-74.0060`). Must be used together with Latitude. Takes priority over Location and IP",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description:
        "City or physical address string (e.g. `New York, USA`). Takes priority over IP",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description:
        "IANA timezone name to observe dates in (e.g. `America/New_York`).",
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
    const parseDate = (value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
      }
      const date = new Date(`${value}T00:00:00Z`);
      return Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== value
        ? null
        : date;
    };

    const start = parseDate(this.dateStart);
    const end = parseDate(this.dateEnd);

    if (!start || !end) {
      throw new Error("`Start Date` and `End Date` must be valid dates in `YYYY-MM-DD` format.");
    }
    if (end < start) {
      throw new Error("`End Date` must be on or after `Start Date`.");
    }
    const diffDays = (end - start) / (1000 * 60 * 60 * 24);
    if (diffDays > 90) {
      throw new Error("Astronomy time series supports a maximum 90-day range.");
    }
    const response = await this.ipgeolocation_io._makeRequest({
      $,
      path: "/astronomy/timeSeries",
      params: {
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
        ip: this.ip,
        lat: this.lat,
        long: this.long,
        location: this.location,
        time_zone: this.timezone,
        lang: this.lang,
      },
    });
    const identifier =  ((this.lat && this.long)
      ? `${this.lat},${this.long}`
      : null) || this.location || this.timezone || this.ip || `caller's IP: ${response.ip}`;
    $.export(
      "$summary",
      `Successfully retrieved astronomy time series from ${this.dateStart} to ${this.dateEnd} for ${identifier}`,
    );
    return response;
  },
};
