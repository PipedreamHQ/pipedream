import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "crimeometer",
  propDefinitions: {
    lat: {
      type: "string",
      label: "Latitude",
      description: "Latitude of the center of the search area. Must be between -90 and 90.",
    },
    lon: {
      type: "string",
      label: "Longitude",
      description: "Longitude of the center of the search area. Must be between -180 and 180.",
    },
    datetimeIni: {
      type: "string",
      label: "Datetime Ini",
      description: "Start date of the search. Must be in the format `YYYY-MM-DD HH:MM:SS`.",
      default: "2023-01-01 00:00:00",
    },
    datetimeEnd: {
      type: "string",
      label: "Datetime End",
      description: "End date of the search. Must be in the format `YYYY-MM-DD HH:MM:SS`.",
      default: "2024-01-01 00:00:00",
    },
    distance: {
      type: "string",
      label: "Distance",
      description: "Distance from the center of the search area. Must be in the format `<number><unit>`, where `<number>` is a positive integer and `<unit>` is one of the following: `mi` (miles), `km` (kilometers), `ft` (feet), or `m` (meters).",
    },
    max: {
      type: "integer",
      label: "Max records",
      description: "Max number of records in the whole pagination",
      default: constants.DEFAULT_MAX_RECORDS,
      min: 1,
    },
  },
  methods: {
    getBaseUrl(versionPath = constants.VERSION_PATH.V1) {
      return `${constants.BASE_URL}${versionPath}`;
    },
    getUrl({
      path, url, versionPath,
    }) {
      return url || `${this.getBaseUrl(versionPath)}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "x-api-key": this.$auth.api_key,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, url, versionPath, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl({
          path,
          url,
          versionPath,
        }),
        ...args,
      };

      return axios(step, config);
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName = constants.DEFAULT_RESOURCE_NAME,
      max = constants.DEFAULT_MAX_RECORDS,
    }) {
      let page = 1;
      let resourcesCount = 0;

      while (true) {
        const {
          total_pages: totalPages,
          [resourceName]: nextResources,
        } = await resourceFn({
          ...resourceFnArgs,
          params: {
            page,
            ...resourceFnArgs.params,
          },
        });

        if (!nextResources?.length) {
          console.log("No more resources");
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;
        }

        if (page >= totalPages || resourcesCount >= max) {
          return;
        }

        page += 1;
      }
    },
  },
};
