import weatherbit_io from "../../weatherbit_io.app.mjs";

export default {
  name: "Fetch Current Weather",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "weatherbit_io-fetch-current-weather",
  description: "Fetch current weather from a location. [See docs here](https://www.weatherbit.io/api/weather-current)",
  type: "action",
  props: {
    weatherbit_io,
    latitude: {
      type: "string",
      label: "Latitude",
      description: "The latitude of the location to fetch the current weather for",
    },
    longitude: {
      type: "string",
      label: "Longitude",
      description: "The longitude of the location to fetch the current weather for",
    },
  },
  async run({ $ }) {
    const response = await this.weatherbit_io.fetchCurrentWeather({
      $,
      params: {
        lat: this.latitude,
        lon: this.longitude,
      },
    });

    if (response) {
      $.export("$summary", "Successfully retrieved current weather");
    }

    return response;
  },
};
