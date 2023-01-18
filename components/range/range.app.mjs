import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "range",
  propDefinitions: {
    commonProperty: {
      type: "string",
      label: "Common property",
      description: "[See the docs here](https://example.com)",
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path) {
      return `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "X-Range-App-ID": this.$auth.oauth_client_id,
        "X-Range-Client": "pipedream/1",
        "Content-Type": "application/json",
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, ...args
    } = {}) {
      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path),
        ...args,
      };
      return axios(step, config);
    },
    async *getResourcesStream({
      resourcesFn,
      resourcesFnArgs,
      resourcesName,
      max = constants.MAX_RESOURCES,
    }) {
      let offset = 0;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourcesFn({
            ...resourcesFnArgs,
            params: {
              ...resourcesFnArgs?.params,
              offset,
            },
          });

        console.log("Response!!!", response);

        const { [resourcesName]: nextResources } = response;

        if (!nextResources?.length) {
          console.log("No more resources");
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            return;
          }
        }

        offset += nextResources.length;
      }
    },
  },
};
