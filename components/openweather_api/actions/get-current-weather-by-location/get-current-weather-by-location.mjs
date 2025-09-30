import { ConfigurationError } from "@pipedream/platform";
import openweatherApi from "../../openweather_api.app.mjs";

export default {
  key: "openweather_api-get-current-weather-by-location",
  name: "Get Current Weather by Location",
  description: `Retrieves the current weather condition by location longitude and latitude. 
  [See the docs here](https://openweathermap.org/current). For more accurate reading, you are advised to fill in the country and/or state code`,
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    openweatherApi,
    city: {
      propDefinition: [
        openweatherApi,
        "city",
      ],
    },
    stateCode: {
      propDefinition: [
        openweatherApi,
        "stateCode",
      ],
    },
    countryCode: {
      propDefinition: [
        openweatherApi,
        "countryCode",
      ],
    },
  },
  async run({ $ }) {
    const appid = this.openweatherApi.$auth.api_key;
    const limit = 1;
    const {
      city,
      stateCode,
      countryCode,
    } = this;
    let location;
    try {
      const qParam = [
        city,
        stateCode,
      ];
      countryCode && qParam.push(countryCode);
      location = await this.openweatherApi.getLocationCordinate({
        q: qParam.join(","),
        limit,
        appid,
      }, $);
      if (!location?.length) {
        throw new Error();
      }
      const locationDetail = location?.length &&
        Object
          .entries(location[0])
          .map((x) => (x.join("=")))
          .join();
      locationDetail && $.export("$summary", `Location retrieved: ${locationDetail}. Getting weather report...`);
    } catch (error) {
      throw new ConfigurationError("Error getting location coordinates");
    }

    const weather = await this.openweatherApi.getCurrentWeather({
      lat: location[0].lat,
      lon: location[0].lon,
      appid,
    }, $);
    weather && $.export("$summary", `${location[0].name},${location[0]?.state} weather report loaded.`);
    return weather;
  },
};
