import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-current",
  name: "Get Current Weather",
  description: "Get current weather data including temperature, humidity, precipitation, wind conditions, atmospheric pressure, and air quality for any location. Accepts city names, coordinates, or IP addresses. Also includes astronomy data and timezone-aware timestamps. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
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
      path: "/v1.0/weather/current",
      params: {
        location: this.location,
        lat: this.lat,
        long: this.long,
        ip: this.ip,
        timezone: this.timezone,
      },
    });
    $.export("$summary", "Successfully executed Get Current Weather");
    return response;
  },
};
