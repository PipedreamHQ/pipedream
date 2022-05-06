import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "openweather_api",
  propDefinitions: {},
  methods: {
    _authToken() {
      return this.$auth.oauth_access_token;
    },
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
        FORCAST_PATH,
        FORCAST_VERSION_PATH,
      } = constants;
      return FORCAST_PATH + FORCAST_VERSION_PATH;
    },
    getAPIUrl(category, path) {
      const {
        BASE_URL,
        Category,
      } = constants;
      const route = (category === Category.GEO && this.getLocationAPI() )
      || (category === Category.WEATHER && this.getWeatherAPI() )
      || (category === Category.FORCAST && this.getForcastAPI() );
      return BASE_URL + route + path;
    },
    async makeRequest(args = {}) {
      const {
        $ = this,
        method = "get",
        path,
        params,
        data,
        category,
      } = args;
      const config = {
        method,
        url: this.getUrl(category, path),
        headers: this.getHeader(),
        params,
        data,
      };
      return axios($, config);
    },
    async getLocationCordinate(params) {
      const {  Category } = constants;
      return this.makeRequest({
        path: "/direct",
        params,
        category: Category.GEO,
      });
    },
    async getCurrentWeather(params) {
      const {  Category } = constants;
      return this.makeRequest({
        path: "/weather",
        params,
        category: Category.WEATHER,
      });
    },
    async getDailyWeatherForcast(params) {
      const {  Category } = constants;
      return this.makeRequest({
        path: "/daily",
        params,
        category: Category.FORCAST,
      });
    },
  },
};
