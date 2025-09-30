import solcast from "../../solcast.app.mjs";

export default {
  key: "solcast-get-live-weather",
  name: "Get Live Weather",
  description: "Get irradiance and weather estimated actuals for near real-time and past 7 days for the requested location, derived from satellite and numerical weather models. [See the documentation](https://docs.solcast.com.au/#b9863910-c788-4e98-a3af-eb8da8f49647)",
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
    const response = await this.solcast.getLiveWeather({
      $,
      params: {
        latitude: this.latitude,
        longitude: this.longitude,
        hours: this.hours,
        period: this.period,
      },
    });
    $.export("$summary", `Successfully retrieved live weather data for location \`${this.latitude}, ${this.longitude}\``);
    return response;
  },
};
