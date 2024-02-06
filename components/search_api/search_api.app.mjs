import { axios } from "@pipedream/platform";
import constants from "./actions/common/constants.mjs";

export default {
  type: "app",
  app: "search_api",
  propDefinitions: {
    q: {
      type: "string",
      label: "Query",
      description: "The search query",
    },
    dataType: {
      type: "string",
      label: "Data Type",
      description: "Parameter defines the data type you wish to search for.",
      options: constants.DATA_TYPE_OPTS,
    },
    time: {
      type: "string",
      label: "Time",
      description: "The parameter determines the time range for the data retrieval.",
      options: constants.TIME_OPTS,
    },
    device: {
      type: "string",
      label: "Device",
      description: "The device to use for the search",
      options: constants.DEVICE_OPTS,
      optional: true,
    },
    size: {
      type: "string",
      label: "Size",
      description: "This parameter controls the size of your search results.",
      options: constants.SIZE_OPTS,
      optional: true,
    },
    color: {
      type: "string",
      label: "Color",
      description: "This parameter controls the color of your search results.",
      options: constants.COLOR_OPTS,
      optional: true,
    },
    timePeriod: {
      type: "string",
      label: "Time Period",
      description: "This parameter restricts results to URLs based on date.",
      options: constants.TIME_PERIOD_OPTS,
      optional: true,
    },
    hl: {
      type: "string",
      label: "Interface Language",
      description: "The default parameter `en` defines the interface language of the search.",
      options: constants.HL_OPTS,
      optional: true,
    },
    gl: {
      type: "string",
      label: "Search Country",
      description: "The default parameter `us` defines the country of the search. ",
      options: constants.GL_OPTS,
      optional: true,
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain to use for the search",
      optional: true,
      options: constants.GOOGLE_DOMAIN_OPTS,
      default: "google.com",
    },
    geo: {
      type: "string",
      label: "Geo",
      description: "The default value for the location parameter is set to `Worldwide`, which denotes a global scope for the search.",
      options: constants.GEO_OPTS,
      optional: true,
    },
    cat: {
      type: "string",
      label: "Categories",
      description: "The parameter for category selection defaults to `0`, representing All Categories. ",
      options: constants.CAT_OPTS,
      optional: true,
    },
    num: {
      type: "integer",
      label: "Number of Results",
      description: "This parameter specifies the number of results to display per page. Use in combination with the page parameter to implement pagination functionality.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "This parameter indicates which page of results to return. By default, it is set to `1`. Use in combination with the num parameter to implement pagination.",
      optional: true,
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://www.searchapi.io/api/v1";
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          ...args.params,
          api_key: this._apiKey(),
        },
      });
    },
    search({
      $,
      params,
      engine,
    }) {
      return this._makeRequest({
        $,
        path: "/search",
        params: {
          ...params,
          engine,
        },
      });
    },
  },
};
