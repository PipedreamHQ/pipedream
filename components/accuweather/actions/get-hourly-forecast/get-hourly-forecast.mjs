import accuweather from "../../accuweather.app.mjs";
import { FORECAST_HOURS_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "accuweather-get-hourly-forecast",
  name: "Get Hourly Forecast",
  description: "Retrieve hourly weather forecast (1-12 hours) for a specific location with detailed weather data. [See the documentation](https://developer.accuweather.com/accuweather-forecast-api/apis)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    accuweather,
    locationKey: {
      propDefinition: [
        accuweather,
        "locationKey",
      ],
    },
    forecastHours: {
      type: "integer",
      label: "Forecast Hours",
      description: "Number of hours to forecast",
      options: FORECAST_HOURS_OPTIONS,
    },
  },
  async run({ $ }) {
    const response = await this.accuweather.getHourlyForecast({
      $,
      locationKey: this.locationKey,
      hours: this.forecastHours,
      params: {
        details: true,
      },
    });

    $.export("$summary", `Retrieved forecast for ${this.forecastHours} hour${this.forecastHours === 1
      ? ""
      : "s"}`);

    return response;
  },
};
