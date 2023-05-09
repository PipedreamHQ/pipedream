import { axios } from "@pipedream/platform";
import common from "../shopify.app.mjs";
import constants from "./constants.mjs";
import utils from "./utils.mjs";

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
    blogId: {
      type: "string",
      label: "Blog ID",
      description: "The unique numeric identifier for the blog.",
      async options() {
        const { blogs } = await this.listBlogs();
        return blogs.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    articleId: {
      type: "string",
      label: "Article ID",
      description: "The unique numeric identifier for the article.",
      async options({ blogId }) {
        const { articles } = await this.listBlogArticles({
          blogId,
        });
        return articles.map(({
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
    listBlogArticles({
      blogId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/blogs/${blogId}/articles`,
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let url;
      let resourcesCount = 0;

      while (true) {
        const stream =
          await resourceFn({
            responseType: "stream",
            url,
            ...resourceFnArgs,
          });

        const { headers: { link } } = stream;

        const linkParsed = utils.parseLinkHeader(link);
        const response = await utils.getDataFromStream(stream);
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

        if (!linkParsed?.next) {
          console.log("Pagination complete");
          return;
        }

        url = linkParsed.next;
      }
    },
  },
};
