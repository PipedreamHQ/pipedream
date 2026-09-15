import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-flood",
  name: "Get Flood Risk Forecast",
  description: "Provides flood forecast data for a given location, including river discharge metrics such as mean, median, maximum, minimum, and percentile values (p25, p75). Requires a startDate and endDate, with the date range limited to 16 days. Location can be specified using city name, latitude/longitude, or IP address. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    startDate: {
      type: "string",
      label: "Startdate",
      description: "Starting date for flood forecast data in YYYY-MM-DD format. Forecast dates must be current or future dates only. Past dates are not allowed for forecast data. The difference between endDate and startDate must not exceed 16 days.",
      optional: false,
    },
    endDate: {
      type: "string",
      label: "Enddate",
      description: "End date for flood forecast data in YYYY-MM-DD format. Forecast dates must be current or future dates only. Past dates are not allowed for forecast data. The difference between endDate and startDate must not exceed 16 days.",
      optional: false,
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
      path: "/v1.0/weather/flood",
      params: {
        startDate: this.startDate,
        endDate: this.endDate,
        location: this.location,
        lat: this.lat,
        long: this.long,
        ip: this.ip,
        timezone: this.timezone,
      },
    });
    $.export("$summary", "Successfully executed Get Flood Risk Forecast");
    return response;
  },
};
