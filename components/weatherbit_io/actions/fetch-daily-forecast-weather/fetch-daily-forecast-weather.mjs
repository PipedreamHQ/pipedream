import weatherbit_io from "../../weatherbit_io.app.mjs";

export default {
  name: "Fetch Daily Forecast Weather",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "weatherbit_io-fetch-daily-forecast-weather",
  description: "Fetch daily forecast weather from a location. [See docs here](https://www.weatherbit.io/api/weather-forecast-16-day)",
  type: "action",
  props: {
    weatherbit_io,
    latitude: {
      type: "string",
      label: "Latitude",
      description: "The latitude of the location for which to fetch the daily forecast.",
    },
    longitude: {
      type: "string",
      label: "Longitude",
      description: "The longitude of the location for which to fetch the daily forecast.",
    },
    days: {
      type: "integer",
      label: "Days",
      description: "The number of days for which to fetch the daily forecast (up to 16).",
      optional: true,
      default: 16,
      max: 16,
    },
  },
  async run({ $ }) {
    const response = await this.weatherbit_io.fetchDailyForecast({
      $,
      params: {
        lat: this.latitude,
        lon: this.longitude,
        days: this.days,
      },
    });

    if (response) {
      $.export("$summary", "Successfully retrieved daily forecast weather");
    }

    return response;
  },
};
