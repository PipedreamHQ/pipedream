import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "shotstack",
  propDefinitions: {
    callback: {
      type: "string",
      label: "Callback URL",
      description: "An optional webhook callback URL used to receive status notifications when a render completes or fails.",
    },
  },
  methods: {
    getBaseUrl(apiPath = constants.API.EDIT) {
      const baseUrl = `${constants.BASE_URL}${apiPath}`;
      return baseUrl.replace(constants.VERSION_PLACEHOLDER, this.$auth.version);
    },
    getUrl({
      apiPath, path, url,
    }) {
      return url || `${this.getBaseUrl(apiPath)}${path}`;
    },
    getHeaders(headers) {
      if (headers === false) {
        return;
      }
      return {
        "Content-Type": "application/json",
        "x-api-key": this.$auth.api_key,
        ...headers,
      };
    },
    makeRequest({
      step = this, apiPath, path, headers, url, ...args
    } = {}) {
      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl({
          apiPath,
          path,
          url,
        }),
        ...args,
      };
      return axios(step, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    listSources(args = {}) {
      return this.makeRequest({
        apiPath: constants.API.INGEST,
        path: "/sources",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName = "data",
    }) {

      const response = await resourceFn(resourceFnArgs);

      const nextResources = resourceName && response[resourceName] || response;

      if (!nextResources?.length) {
        console.log("No more resources found");
        return;
      }

      for (const resource of nextResources) {
        yield resource;
      }
    },
  },
};
