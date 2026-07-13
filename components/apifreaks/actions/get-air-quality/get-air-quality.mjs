import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-air-quality",
  name: "Get Air Quality Data",
  description: "Monitor and predict air quality conditions using European and US AQI standards. Track pollutant concentrations including PM10, PM2.5, carbon monoxide, nitrogen dioxide, sulfur dioxide, ozone, and dust particles. Get current readings plus hourly forecasts up to 5 days ahead, complete with UV index and aerosol measurements for comprehensive air quality assessment. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    startDate: {
      type: "string",
      label: "Startdate",
      description: "Starting date for AQI forecast data in YYYY-MM-DD format. Forecast dates must be current or future dates only. Past dates are not allowed for forecast data. The difference between endDate and startDate must not exceed 5 days.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "Enddate",
      description: "End date for AQI forecast data in YYYY-MM-DD format. Forecast dates must be current or future dates only. Past dates are not allowed for forecast data. The difference between endDate and startDate must not exceed 5 days.",
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
      path: "/v1.0/weather/air-quality",
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
    $.export("$summary", "Successfully executed Get Air Quality Data");
    return response;
  },
};
