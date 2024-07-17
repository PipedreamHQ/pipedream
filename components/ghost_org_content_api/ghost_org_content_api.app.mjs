import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "ghost_org_content_api",
  propDefinitions: {},
  methods: {
    getURL(path) {
      const { admin_domain: domain } = this.$auth;
      return `${domain.includes("https://")
        ? ""
        : "https://"}${domain}${constants.VERSION_PATH}${path}`;
    },
    async makeRequest({
      $ = this, path, params, ...args
    } = {}) {
      const config = {
        url: this.getURL(path),
        params: {
          key: this.$auth.content_api_key,
          ...params,
        },
        headers: {
          "Accept-Version": "v5.0",
        },
        ...args,
      };
      return axios($, config);
    },
    async getAuthors(args = {}) {
      return this.makeRequest({
        path: "/authors/",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName,
      max = constants.MAX_RESOURCES,
    }) {
      let page = 1;
      let resourcesCount = 0;
      let nextResources;
      let meta;

      while (true) {
        try {
          ({
            meta,
            [resourceName]: nextResources,
          } = await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs.params,
              page,
            },
          }));
        } catch (error) {
          console.log("Stream error", error);
          return;
        }

        if (nextResources?.length < 1) {
          return;
        }

        page += 1;

        for (const resource of nextResources) {
          resourcesCount += 1;
          yield resource;
        }

        if (page >= meta?.pagination?.pages || (max && resourcesCount >= max)) {
          return;
        }
      }
    },
  },
};
