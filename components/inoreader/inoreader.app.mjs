import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import category from "./sources/common/category.mjs";

export default {
  type: "app",
  app: "inoreader",
  propDefinitions: {
    feedId: {
      type: "string",
      label: "Feed ID",
      description: "The ID of the feed to subscribe to. Example: `feed/http://feeds.arstechnica.com/arstechnica/science`.",
    },
    tagName: {
      type: "string",
      label: "Tag Name",
      description: "The name of the tag or folder. Example: `user/1005921515/label/DIY`.",
      async options() {
        const { tags } = await this.listTags({
          params: {
            types: 1,
            counts: 1,
          },
        });
        return tags
          .filter(({ type }) => [
            "tag",
            "folder",
          ].includes(type))
          .map(({ id }) => id);
      },
    },
  },
  methods: {
    prefixFeed(feedId) {
      const prefix = category.FEED;
      return feedId?.startsWith(prefix)
        ? feedId
        : `${prefix}${feedId}`;
    },
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
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
    listSubscriptions(args = {}) {
      return this.makeRequest({
        path: "/subscription/list",
        ...args,
      });
    },
    listStreamContents({
      feedId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/stream/contents/${feedId}`,
        ...args,
      });
    },
    listTags(args = {}) {
      return this.makeRequest({
        path: "/tag/list",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let continuation;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              c: continuation,
              ...resourceFnArgs?.params,
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

        if (!response.continuation) {
          console.log("No more resources for this continuation");
          return;
        }

        continuation = response.continuation;
      }
    },
  },
};
