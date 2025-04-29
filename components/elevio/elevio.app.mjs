import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "elevio",
  propDefinitions: {
    articleId: {
      type: "string",
      label: "Article ID",
      description: "The identifier of the article",
      async options({ page }) {
        const { articles } = await this.listArticles({
          params: {
            page: page + 1,
          },
        });
        return articles.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    restriction: {
      type: "string",
      label: "Restriction",
      description: "Restriction level of the article",
      default: "unrestricted",
      options: [
        "restricted",
        "unrestricted",
        "noaccess",
      ],
    },
    discoverable: {
      type: "boolean",
      label: "Discoverable",
      description: "Whether the article is discoverable",
      default: true,
    },
    isInternal: {
      type: "boolean",
      label: "Internal",
      description: "Whether the article is internal",
      default: false,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes associated with the article",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the article",
      default: "published",
      options: [
        "draft",
        "published",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the article",
    },
    body: {
      type: "string",
      label: "Content",
      description: "The content body of the article",
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The category ID for the article",
      async options() {
        const { categories } = await this.listCategories();
        return categories.map(({
          id: value, translations,
        }) => ({
          label: translations[0].title,
          value,
        }));
      },
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "The external identifier of the article",
      optional: true,
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "List of global keywords for tagging and discoverability.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags associated with this article.",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      const {
        api_token: apiToken,
        api_key: apiKey,
      } = this.$auth;
      return {
        "Authorization": `Bearer ${apiToken}`,
        "x-api-key": apiKey,
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
    listCategories(args = {}) {
      return this._makeRequest({
        path: "/categories",
        ...args,
      });
    },
    listArticles(args = {}) {
      return this._makeRequest({
        path: "/articles",
        ...args,
      });
    },
    listCards({
      folder, ...args
    } = {}) {
      return this._makeRequest({
        path: `/cards/folders/${folder}`,
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
              page_size: constants.DEFAULT_LIMIT,
            },
          });

        const nextResources = utils.getNestedProperty(response, resourceName);

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          const isDateGreater =
            lastDateAt
              && Date.parse(resource[dateField]) > Date.parse(lastDateAt);

          if (!lastDateAt || isDateGreater) {
            yield resource;
            resourcesCount += 1;
          }

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
