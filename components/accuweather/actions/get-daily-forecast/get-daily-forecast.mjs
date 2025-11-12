import accuweather from "../../accuweather.app.mjs";
import { FORECAST_DAYS_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "accuweather-get-daily-forecast",
  name: "Get Daily Forecast",
  description: "Get daily weather forecast for a specific location with temperature, precipitation, and conditions. [See the documentation](https://developer.accuweather.com/accuweather-forecast-api/apis)",
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
    forecastDays: {
      type: "integer",
      label: "Forecast Days",
      description: "Number of days to forecast",
      options: FORECAST_DAYS_OPTIONS,
    },
  },
  async run({ $ }) {
    const response = await this.accuweather.getDailyForecast({
      $,
      locationKey: this.locationKey,
      days: this.forecastDays,
      params: {
        details: true,
      },
    });

    $.export("$summary", `Retrieved forecast for ${this.forecastDays} day${this.forecastDays === 1
      ? ""
      : "s"}`);

    return response;
  },
};
