import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "openweather_api",
  propDefinitions: {
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
    lang: {
      type: "string",
      label: "Language",
      description: "See doc [here](https://openweathermap.org/forecast16#multi)",
      optional: true,
      options() {
        return Object.keys(constants.LANGUAGES).map((key) => ({
          label: constants.LANGUAGES[key],
          value: key,
        }));
      },
    },
  },
  methods: {
    getHeader() {
      return {
        "Content-Type": "application/json",
      };
    },
    getLocationAPI() {
      const {
        GEO_PATH,
        GEO_VERSION_PATH,
      } = constants;
      return GEO_PATH + GEO_VERSION_PATH;
    },
    getWeatherAPI() {
      const {
        WEATHER_PATH,
        WEATHER_VERSION_PATH,
      } = constants;
      return WEATHER_PATH + WEATHER_VERSION_PATH;
    },
    getForcastAPI() {
      const {
        FORECAST_PATH,
        FORECAST_VERSION_PATH,
      } = constants;
      return FORECAST_PATH + FORECAST_VERSION_PATH;
    },
    getAPIUrl(category, path) {
      const {
        BASE_URL,
        CATEGORIES,
      } = constants;
      const route = (category === CATEGORIES.GEO && this.getLocationAPI() )
      || (category === CATEGORIES.WEATHER && this.getWeatherAPI() )
      || (category === CATEGORIES.FORECAST && this.getForcastAPI() );
      return BASE_URL + route + path;
    },
    async makeRequest(args = {}) {
      const {
        $,
        method = "get",
        path,
        params,
        data,
        category,
      } = args;
      const config = {
        method,
        url: this.getAPIUrl(category, path),
        headers: this.getHeader(),
        params,
        data,
      };
      return axios($ ?? this, config);
    },
    async getLocationCordinate(params, $) {
      const {  CATEGORIES } = constants;
      return this.makeRequest({
        path: "/direct",
        params,
        category: CATEGORIES.GEO,
        $,
      });
    },
    async getCurrentWeather(params, $) {
      const {  CATEGORIES } = constants;
      return this.makeRequest({
        path: "/weather",
        params,
        category: CATEGORIES.WEATHER,
        $,
      });
    },
    async getDailyWeatherForcast(params, $) {
      const {  CATEGORIES } = constants;
      return this.makeRequest({
        path: "/daily",
        params,
        category: CATEGORIES.FORECAST,
        $,
      });
    },
  },
};
