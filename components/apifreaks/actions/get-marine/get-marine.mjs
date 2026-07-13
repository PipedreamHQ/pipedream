import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-marine",
  name: "Get Marine Weather Forecast",
  description: "Provides hourly forecasts of marine conditions including wave heights, wave directions, wave periods, swell info, sea surface temperatures, and ocean currents. Supports multiple geographical points and returns daily max wave statistics for up to 7 days. Ideal for maritime planning, navigation, and coastal activities. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    startDate: {
      type: "string",
      label: "Startdate",
      description: "Starting date for marine forecast data in YYYY-MM-DD format. Forecast dates must be current or future dates only. Past dates are not allowed for forecast data. The difference between endDate and startDate must not exceed 16 days.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "Enddate",
      description: "End date for marine forecast data in YYYY-MM-DD format. Forecast dates must be current or future dates only. Past dates are not allowed for forecast data. The difference between endDate and startDate must not exceed 16 days.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "City name, place name, or full address.",
      optional: true,
    },
    lat: {
      type: "string",
      label: "Lat",
      description: "Latitude of the location.",
      optional: true,
    },
    long: {
      type: "string",
      label: "Long",
      description: "Longitude of the location.",
      optional: true,
    },
    ip: {
      type: "string",
      label: "Ip",
      description: "IP(v4 or v6) address for location inference.",
      optional: true,
    },
    precision: {
      type: "string",
      label: "Precision",
      description: "Precision of the marine data.",
      optional: true,
      options: ["daily","hourly","minutely"],
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "Timezone for the results.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/weather/marine",
      params: {
        startDate: this.startDate,
        endDate: this.endDate,
        location: this.location,
        lat: this.lat,
        long: this.long,
        ip: this.ip,
        precision: this.precision,
        timezone: this.timezone,
      },
    });
    $.export("$summary", "Successfully executed Get Marine Weather Forecast");
    return response;
  },
};
