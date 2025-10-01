import accuweather from "../../accuweather.app.mjs";
import { HISTORICAL_TIME_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "accuweather-get-historical-weather",
  name: "Get Historical Weather",
  description: "Retrieve historical weather data for a specific location and date range. [See the documentation](https://developer.accuweather.com/accuweather-current-conditions-api/apis)",
  version: "0.0.2",
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
    historicalTime: {
      type: "integer",
      label: "Historical Time",
      description: "Historical time for weather data",
      options: HISTORICAL_TIME_OPTIONS,
    },
  },
  async run({ $ }) {
    const response = await this.accuweather.getHistoricalWeather({
      $,
      locationKey: this.locationKey,
      time: this.historicalTime,
    });

    $.export("$summary", `Retrieved historical weather data for ${this.historicalTime} hours`);
    return response;
  },
};
