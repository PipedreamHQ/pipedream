import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "precisefp",
  propDefinitions: {},
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
        "Authorization": `${this.$auth.api_token}`,
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
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    listAccounts(args = {}) {
      return this.makeRequest({
        path: "/accounts",
        ...args,
      });
    },
    listPDFEngagements(args = {}) {
      return this.makeRequest({
        path: "/pdf-engagements",
        ...args,
      });
    },
    listFormEngagements(args = {}) {
      return this.makeRequest({
        path: "/form-engagements",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let offset = 0;
      let resourcesCount = 0;

      while (true) {
        console.log(`Fetching resources with offset ${offset}`);
        const response =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs.params,
              offset,
            },
          });

        const nextResources = resourceName && response[resourceName] || response;

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            return;
          }
        }

        offset = response.params?.offset;
      }
    },
  },
};
