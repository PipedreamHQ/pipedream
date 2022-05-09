import { ConfigurationError } from "@pipedream/platform";
import openweatherApi from "../../openweather_api.app.mjs";

export default {
  key: "openweather_api-get-current-weather-by-location",
  name: "Get Current Weather by Location",
  description: `Retrieves the current weather condition by location longitude and latitude. 
  [See the docs here](https://openweathermap.org/current). For more accurate reading, you are adviced to fill in the state code and/or country code`,
  version: "0.0.1",
  type: "action",
  props: {
    openweatherApi,
    appid: {
      propDefinition: [
        openweatherApi,
        "appId",
      ],
    },
    city: {
      type: "string",
      label: "City",
      description: "City location. For example \"Houston\" in the United States.",
    },
    stateCode: {
      type: "string",
      label: "State code",
      description: "State code. For example \"TX\" for Texas.",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The 2 or 3-letter country code, for example \"US\" for the United States.",
      optional: true,
    },
  },
  async run({ $ }) {
    const limit = 1;
    const {
      appid,
      city,
      stateCode,
      countryCode,
    } = this ;
    let location;
    try {
      location = await  this.openweatherApi.getLocationCordinate({
        q: `${city},${stateCode},${countryCode}`,
        limit,
        appid,
      });
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
      throw new ConfigurationError("Error getting location cordinates" );
    }

    const weather = await  this.openweatherApi.getCurrentWeather({
      lat: location[0].lat,
      lon: location[0].lon,
      appid,
    });
    weather && $.export("$summary", `${location[0].name},${location[0]?.state} weather report loaded `);
    return weather;
  },
};
