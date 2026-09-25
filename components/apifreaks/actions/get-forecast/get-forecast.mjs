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
      propDefinition: [
        app,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        app,
        "endDate",
      ],
    },
    forecastDays: {
      type: "string",
      label: "Forecastdays",
      description: "Number of days for the forecast, from 1 to 16. Default is 7. Maximum value is 16.",
      optional: true,
    },
    location: {
      propDefinition: [
        app,
        "location",
      ],
    },
    lat: {
      propDefinition: [
        app,
        "lat",
      ],
    },
    long: {
      propDefinition: [
        app,
        "long",
      ],
    },
    ip: {
      propDefinition: [
        app,
        "ip",
      ],
    },
    precision: {
      type: "string",
      label: "Precision",
      description: "Precision of the forecast data.",
      optional: true,
      options: ["daily","hourly","minutely"],
    },
    timezone: {
      propDefinition: [
        app,
        "timezone",
      ],
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
