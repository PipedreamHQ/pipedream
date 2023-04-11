import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "geodb_cities",
  propDefinitions: {
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The code of the country to get the details for.",
      async options({ prevContext }) {
        const { offset = 0 } = prevContext;
        const { data } = await this.listCountries({
          params: {
            offset,
            limit: constants.DEFAULT_LIMIT,
          },
        });
        return {
          options: data.map(({
            code: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            offset: offset + constants.DEFAULT_LIMIT,
          },
        };
      },
    },
    regionId: {
      type: "string",
      label: "Region ID",
      description: "The ID of the region to get the details for.",
      async options({
        prevContext, countryCode,
      }) {
        const { offset = 0 } = prevContext;
        const { data } = await this.listCountryRegions({
          countryCode,
          params: {
            offset,
            limit: constants.DEFAULT_LIMIT,
          },
        });
        return {
          options: data.map(({
            isoCode: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            offset: offset + constants.DEFAULT_LIMIT,
          },
        };
      },
    },
    languageCode: {
      type: "string",
      label: "Language Code",
      description: "The language to use for the name property. If not set, the name will be in English. Possible values are: `en`, `de`, `es`, `fr`, `it`, `pt`, `ru`, `zh`.",
      optional: true,
      options: constants.LANG_CODES,
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "x-rapidapi-key": this.$auth.api_key,
        "x-rapidapi-host": constants.HOST,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        ...args,
      };

      return axios(step, config);
    },
    listCountries(args = {}) {
      return this.makeRequest({
        path: "/geo/countries",
        ...args,
      });
    },
    listCountryRegions({
      countryCode, ...args
    } = {}) {
      return this.makeRequest({
        path: `/geo/countries/${countryCode}/regions`,
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      max = constants.DEFAULT_MAX_RECORDS,
    }) {
      let offset = 0;
      let resourcesCount = 0;

      while (true) {
        const {
          links = [],
          data: nextResources,
        } = await resourceFn({
          ...resourceFnArgs,
          params: {
            offset,
            limit: constants.DEFAULT_LIMIT,
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

          if (max && resourcesCount >= max) {
            console.log(`Reached max number of resources: ${max} and count is: ${resourcesCount}`);
            return;
          }
        }

        const hasNext = links.find(({ rel }) => rel === "next");

        if (!hasNext) {
          console.log("Has no next page");
          return;
        }

        offset += constants.DEFAULT_LIMIT;

        // wait 2 seconds before making the next request
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    },
  },
};
