import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "parseur",
  propDefinitions: {
    parserId: {
      type: "string",
      label: "Parser ID",
      description: "The ID of the parser.",
      async options({ page }) {
        const { results } = await this.listMailboxes({
          params: {
            page: page + 1,
            page_size: constants.DEFAULT_LIMIT,
          },
        });
        return results.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    parserField: {
      type: "string",
      label: "Parser Field",
      description: "The ID of the parser field.",
      async options({
        parserId,
        typeFilter = ([
          , value,
        ]) => value.type === constants.PROPERTY_TYPE.ARRAY,
      }) {
        const { properties } = await this.getParserSchema({
          parserId,
        });
        return Object.entries(properties)
          .filter(typeFilter)
          .map(([
            key,
          ]) => key);
      },
    },
  },
  methods: {
    getUrl(path, url) {
      return url || `${constants.BASE_URL}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Token ${this.$auth.api_token}`,
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
    create(args = {}) {
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
    getParserSchema({
      parserId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/parser/${parserId}/schema`,
        ...args,
      });
    },
    listMailboxes(args = {}) {
      return this.makeRequest({
        path: "/parser",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      max = constants.DEFAULT_MAX,
    }) {
      let page = 1;
      let resourcesCount = 0;

      while (true) {
        const {
          total,
          results: nextResources,
        } =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs.params,
              page,
            },
          });

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max || resourcesCount >= total) {
            return;
          }
        }

        page += 1;
      }
    },
  },
};
