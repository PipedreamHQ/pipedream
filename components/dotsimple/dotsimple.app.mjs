import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "dotsimple",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The ID of the account you wish to use.",
      async options() {
        const { data } = await this.listAccounts();
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    contentBody: {
      type: "string",
      label: "Content Body",
      description: "The content of the post.",
    },
    contentUrl: {
      type: "string",
      label: "Content URL",
      description: "Insert a URL for the post. Facebook and LinkedIn support it.",
      optional: true,
    },
    postId: {
      type: "string",
      label: "Post ID",
      description: "The ID of the post you wish to delete or update.",
      async options({ page }) {
        const { data } = await this.listPosts({
          params: {
            page: page + 1,
          },
        });
        return data.map(({ uuid }) => uuid);
      },
    },
  },
  methods: {
    getUrl(path) {
      const baseUrl =
        `${constants.BASE_URL}${constants.VERSION_PATH}`
          .replace(constants.WORKSPACE_PLACEHOLDER, this.$auth.workspace_id);
      return `${baseUrl}${path}`;
    },
    getHeaders(headers) {
      return {
        Authorization: `Bearer ${this.$auth.access_token}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    put(args = {}) {
      return this._makeRequest({
        method: "PUT",
        ...args,
      });
    },
    listAccounts(args = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...args,
      });
    },
    listPosts(args = {}) {
      return this._makeRequest({
        path: "/posts",
        ...args,
      });
    },
    listMediaFiles(args = {}) {
      return this._makeRequest({
        path: "/media",
        ...args,
      });
    },
    async *getIterations({
      resourcesFn, resourcesFnArgs, resourceName = "data",
      max = constants.DEFAULT_MAX,
    }) {
      let page = 1;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourcesFn({
            ...resourcesFnArgs,
            params: {
              ...resourcesFnArgs?.params,
              page,
              per_page: constants.DEFAULT_LIMIT,
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
            console.log("Reached max resources");
            return;
          }
        }

        if (nextResources.length < constants.DEFAULT_LIMIT) {
          console.log("No next page found");
          return;
        }

        page += 1;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
