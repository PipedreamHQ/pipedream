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
      description: "Precision of the marine data.",
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
