import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "shotstack",
  propDefinitions: {
    commonProperty: {
      type: "string",
      label: "Common property",
      description: "[See the docs here](https://example.com)",
    },
  },
  methods: {
    getBaseUrl(apiPath = constants.API.EDIT.path) {
      const baseUrl = `${constants.BASE_URL}${apiPath}`;
      return baseUrl.replace(constants.VERSION_PLACEHOLDER, this.$auth.version);
    },
    getUrl({
      apiPath, path, url,
    }) {
      return url || `${this.getBaseUrl(apiPath)}${path}`;
    },
    getHeaders(headers) {
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
    update(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    patch(args = {}) {
      return this.makeRequest({
        method: "patch",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName,
      lastCreatedAt,
      max = constants.DEFAULT_MAX,
    }) {
      let page = 1;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs.params,
              page,
            },
          });

        const nextResources = resourceName && response[resourceName] || response;

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          const dateFilter =
            lastCreatedAt
            && Date.parse(resource.created_at) > Date.parse(lastCreatedAt);

          if (!lastCreatedAt || dateFilter) {
            yield resource;
            resourcesCount += 1;
          }

          if (resourcesCount >= max) {
            return;
          }
        }

        page += 1;
      }
    },
  },
};
