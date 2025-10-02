import solcast from "../../solcast.app.mjs";

export default {
  key: "solcast-get-weather-forecast",
  name: "Get Weather Forecast",
  description: "Get irradiance and weather forecasts for the requested location from the present up to 14 days ahead, derived from satellite and numerical weather models. [See the documentation](https://docs.solcast.com.au/#4e0e8a96-7a12-4654-8407-6bbbb37478b1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    solcast,
    latitude: {
      propDefinition: [
        solcast,
        "latitude",
      ],
    },
    longitude: {
      propDefinition: [
        solcast,
        "longitude",
      ],
    },
    hours: {
      propDefinition: [
        solcast,
        "hours",
      ],
    },
    period: {
      propDefinition: [
        solcast,
        "period",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.solcast.getWeatherForecast({
      $,
      params: {
        latitude: this.latitude,
        longitude: this.longitude,
        hours: this.hours,
        period: this.period,
      },
    });
    $.export("$summary", `Successfully retrieved forecast data for location \`${this.latitude}, ${this.longitude}\``);
    return response;
  },
};
