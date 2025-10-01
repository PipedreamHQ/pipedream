import weatherbit_io from "../../weatherbit_io.app.mjs";

export default {
  name: "Fetch Historical Weather Data",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "weatherbit_io-fetch-historical-weather-data",
  description: "Fetch historical wheater data from a location. [See docs here](https://www.weatherbit.io/api/weather-history-daily)",
  type: "action",
  props: {
    weatherbit_io,
    latitude: {
      type: "string",
      label: "Latitude",
      description: "The latitude of the location for which to fetch historical weather data.",
    },
    longitude: {
      type: "string",
      label: "Longitude",
      description: "The longitude of the location for which to fetch historical weather data.",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the date range for which to fetch historical weather data (format: YYYY-MM-DD).",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the date range for which to fetch historical weather data (format: YYYY-MM-DD).",
    },
  },
  async run({ $ }) {
    const response = await this.weatherbit_io.fetchHistoricalWeatherData({
      $,
      params: {
        lat: this.latitude,
        lon: this.longitude,
        start_date: this.startDate,
        end_date: this.endDate,
      },
    });

    if (response) {
      $.export("$summary", "Successfully retrieved historical weather data");
    }

    return response;
  },
};
