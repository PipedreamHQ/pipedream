import { axios } from "@pipedream/platform";
import common from "../shopify.app.mjs";
import constants from "./constants.mjs";

export default {
  ...common,
  propDefinitions: {
    ...common.propDefinitions,
    bodyHtml: {
      type: "string",
      label: "Body HTML",
      description: "The text content of the page, complete with HTML markup.",
    },
    pageId: {
      type: "string",
      label: "Page ID",
      description: "The unique numeric identifier for the page.",
      async options() {
        const { pages } = await this.listPages();
        return pages.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    ...common.methods,
    getBaseUrl() {
      const baseUrl = `${constants.BASE_URL}${constants.VERSION_PATH}`;
      return baseUrl.replace(constants.STORE_PLACEHOLDER, this.getShopId());
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}.json`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": this.$auth.oauth_access_token,
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
      console.log("config!!!", JSON.stringify(config, null, 2));

      return axios(step, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    put(args = {}) {
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
    listPages(args = {}) {
      return this.makeRequest({
        path: "/pages",
        ...args,
      });
    },
    listBlogs(args = {}) {
      return this.makeRequest({
        path: "/blogs",
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
