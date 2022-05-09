import { ConfigurationError } from "@pipedream/platform";
import openweatherApi from "../../openweather_api.app.mjs";

export default {
  key: "openweather_api-get-weather-forecast-by-location",
  name: "Get Current Weather Forcast by Location",
  description: `Retrieves 1-16 days weather forecast for a specified location. 
  [See the docs here](https://openweathermap.org/forecast16#geo16). For more accurate reading, you are advised to fill in the country code and/orstate code `,
  version: "0.0.1",
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
    cnt: {
      type: "integer",
      label: "Days count",
      description: "Number of days, which will be returned in the API response",
      min: 1,
      max: 16,
      default: 1,
      optional: true,
    },
    units: {
      type: "string",
      label: "Units of measurement",
      description: "Standard, metric and imperial units are available. Standard units will be applied by default",
      options: [
        "standard",
        "metric",
        "imperial",
      ],
      optional: true,
    },
    lang: {
      type: "string",
      label: "Language",
      description: "See doc [here](https://openweathermap.org/forecast16#multi)",
      optional: true,
    },
  },
  async run({ $ }) {
    const appid = this.openweatherApi.$auth.api_key;
    const limit = 1;
    const {
      city,
      stateCode,
      countryCode,
      cnt,
      units,
      lang,
    } = this ;
    let location;
    try {
      location = await this.openweatherApi.getLocationCordinate({
        q: `${city},${stateCode},${countryCode}`,
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
      throw new ConfigurationError("Error getting location coordinates" );
    }

    const weatherForcast = await  this.openweatherApi.getDailyWeatherForcast({
      lat: location[0].lat,
      lon: location[0].lon,
      appid,
      cnt,
      units,
      lang,
    }, $);
    weatherForcast && $.export("$summary", `${location[0].name},${location[0]?.state} weather forcast loaded.`);
    return weatherForcast;
  },
};
