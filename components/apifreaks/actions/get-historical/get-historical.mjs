import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-historical",
  name: "Get Historical Weather",
  description: "Access past weather conditions for specific dates with records going back to 1940. Retrieve comprehensive historical data with both daily and hourly precision options. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    date: {
      type: "string",
      label: "Date",
      description: "Specific date for which to fetch weather data in YYYY-MM-DD format. Historical dates must be past dates only. Current or future dates are not allowed for historical data. Data available from 1940 onwards.",
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
    precision: {
      type: "string",
      label: "Precision",
      description: "Precision of the historical data. **Note:** 'daily' returns daily aggregates, 'hourly' returns hourly data.",
      optional: true,
      options: ["daily","hourly"],
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
      path: "/v1.0/weather/historical",
      params: {
        date: this.date,
        location: this.location,
        lat: this.lat,
        long: this.long,
        ip: this.ip,
        precision: this.precision,
        timezone: this.timezone,
      },
    });
    $.export("$summary", "Successfully executed Get Historical Weather");
    return response;
  },
};
