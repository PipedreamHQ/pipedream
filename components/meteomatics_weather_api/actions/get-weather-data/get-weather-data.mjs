import app from "../../meteomatics_weather_api.app.mjs";

export default {
  key: "meteomatics_weather_api-get-weather-data",
  name: "Get Weather Data",
  description: "Retrieve historic, current, and forecast data globally. [See the documentation](https://www.meteomatics.com/en/api/getting-started/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    validDateTime: {
      propDefinition: [
        app,
        "validDateTime",
      ],
    },
    parameters: {
      propDefinition: [
        app,
        "parameters",
      ],
    },
    locations: {
      propDefinition: [
        app,
        "locations",
      ],
    },
    format: {
      propDefinition: [
        app,
        "format",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getWeatherData({
      $,
      validdatetime: this.validDateTime.join("--"),
      parameters: this.parameters.join(","),
      locations: this.locations,
      format: this.format,
    });

    $.export("$summary", "Successfully retrieved weather data");

    return response;
  },
};
