import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "dropinblog",
  propDefinitions: {
    title: {
      type: "string",
      label: "Title",
      description: "Title for your blog post.",
    },
    content: {
      type: "string",
      label: "Body",
      description: "The body content of your blog post in HTML.",
    },
    categoryId: {
      type: "integer",
      label: "Category ID",
      description: "Category ID to attach to your post.",
      optional: true,
      async options() {
        const { data: { categories } } = await this.listCategories();
        return categories.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    authorId: {
      type: "string",
      label: "Author ID",
      description: "Author ID to attach to your post.",
      optional: true,
      async options() {
        const { data: { authors } } = await this.listAuthors();
        return authors.map(({
          id, name: label,
        }) => ({
          label,
          value: String(id),
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      const baseUrl =
        `${constants.BASE_URL}${constants.VERSION_PATH}`
          .replace(constants.BLOG_PLACEHOLDER, this.$auth.blog_id);
      return `${baseUrl}${path}`;
    },
    getHeaders({
      usePrivateApiKey, ...headers
    } = {}) {
      const {
        private_api_key: privateApiKey,
        public_api_key: publicApiKey,
      } = this.$auth;

      const apiKey = usePrivateApiKey
        ? privateApiKey
        : publicApiKey;

      return {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
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
    listCategories(args = {}) {
      return this._makeRequest({
        path: "/categories",
        ...args,
      });
    },
    listAuthors(args = {}) {
      return this._makeRequest({
        path: "/authors",
        ...args,
      });
    },
    listPosts(args = {}) {
      return this._makeRequest({
        path: "/posts",
        ...args,
      });
    },
    async *getIterations({
      resourcesFn, resourcesFnArgs, resourceName,
      lastDateAt, dateField,
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
              limit: constants.DEFAULT_LIMIT,
            },
          });

        const nextResources = utils.getNestedProperty(response, resourceName);

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          const dateIsGreaterThan =
            lastDateAt
              && Date.parse(resource[dateField]) > Date.parse(lastDateAt);

          if (!lastDateAt || dateIsGreaterThan) {
            yield resource;
            resourcesCount += 1;
          }

          if (resourcesCount >= max) {
            console.log("Reached max resources");
            return;
          }
        }

        if (!response.next_page_url) {
          console.log("No next page.");
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
