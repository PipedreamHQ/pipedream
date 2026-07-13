import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-forecast",
  name: "Get Weather Forecast",
  description: "Access comprehensive weather forecasts with customizable precision - choose from daily overviews, hourly breakdowns, or even minute-by-minute data. Configure your date ranges or use the default 7-day forecast for standard weather planning. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    startDate: {
      type: "string",
      label: "Startdate",
      description: "Start date for the forecast in YYYY-MM-DD format. Forecast dates must be current or future dates only. Past dates are not allowed for forecast data. The difference between startDate and endDate must not exceed 16 days.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "Enddate",
      description: "End date for the forecast in YYYY-MM-DD format. Forecast dates must be current or future dates only. Past dates are not allowed for forecast data. The difference between startDate and endDate must not exceed 16 days.",
      optional: true,
    },
    forecastDays: {
      type: "string",
      label: "Forecastdays",
      description: "Number of days for the forecast, from 1 to 16. Default is 7. Maximum value is 16.",
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
      description: "Precision of the forecast data.",
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
      path: "/v1.0/weather/forecast",
      params: {
        startDate: this.startDate,
        endDate: this.endDate,
        forecastDays: this.forecastDays,
        location: this.location,
        lat: this.lat,
        long: this.long,
        ip: this.ip,
        precision: this.precision,
        timezone: this.timezone,
      },
    });
    $.export("$summary", "Successfully executed Get Weather Forecast");
    return response;
  },
};
