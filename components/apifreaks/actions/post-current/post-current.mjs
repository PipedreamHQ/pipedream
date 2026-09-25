import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-post-current",
  name: "Get Current Weather for Multiple Locations",
  description: "Retrieve current weather conditions for up to `50 locations` in a single request. A maximum of 50 locations (city names, IP addresses, or geographic coordinates) can be included in the request body. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
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
      method: "POST",
      path: "/v1.0/weather/current",
      params: {
        timezone: this.timezone,
      },
    });
    $.export("$summary", "Successfully executed Get Current Weather for Multiple Locations");
    return response;
  },
};
