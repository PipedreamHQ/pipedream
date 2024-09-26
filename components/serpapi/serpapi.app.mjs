import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "serpapi",
  propDefinitions: {
    engine: {
      type: "string",
      label: "Engine",
      description: "Engine to send the query to",
      options: constants.ENGINES,
    },
    q: {
      type: "string[]",
      label: "Query",
      description: "The query or queries you want to search. When passing multiple queries you need to use a comma `,` to separate them",
    },
    device: {
      type: "string",
      label: "Device",
      description: "Defines the device to use to get the results",
      options: constants.DEVICES,
    },
    noCache: {
      type: "boolean",
      label: "No Cache",
      description: "Force SerpApi to fetch the Google results even if a cached version is already present",
    },
  },
  methods: {
    _baseUrl() {
      return "https://serpapi.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params: {
          ...params,
          api_key: this.$auth.api_key,
        },
      });
    },
    async scrapeSearch(args = {}) {
      return this._makeRequest({
        path: "/search",
        ...args,
      });
    },
  },
};
