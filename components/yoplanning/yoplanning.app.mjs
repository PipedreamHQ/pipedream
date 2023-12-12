import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "yoplanning",
  propDefinitions: {
    teamId: {
      type: "string",
      label: "Team ID",
      description: "The ID of the team to which the client belongs",
      async options({ prevContext }) {
        const { offset } = prevContext;
        if (offset === null) {
          return [];
        }

        const {
          next,
          results,
        } = await this.listTeams({
          params: {
            limit: constants.DEFAULT_LIMIT,
            offset: offset || 0,
          },
        });

        const options = results.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));

        return {
          options,
          context: {
            offset: next
              ? offset + constants.DEFAULT_LIMIT
              : null,
          },
        };
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path) {
      return `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Token ${this.$auth.api_key}`,
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
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    listTeams(args = {}) {
      return this.makeRequest({
        path: "/teams/",
        ...args,
      });
    },
    listOrders({
      teamId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/teams/${teamId}/orders/`,
        ...args,
      });
    },
    listClients({
      teamId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/teams/${teamId}/clients/`,
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn, resourceFnArgs, resourceName, max = constants.DEFAULT_MAX,
    } = {}) {
      let offset = 0;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs?.params,
              offset,
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

        if (!response.next) {
          console.log("There is no next page");
          return;
        }

        offset += constants.DEFAULT_LIMIT;
      }
    },
    paginate({
      resourceFn, resourceFnArgs, resourceName, ...args
    } = {}) {
      const stream = this.getResourcesStream({
        resourceFn,
        resourceFnArgs,
        resourceName,
        ...args,
      });
      return utils.streamIterator(stream);
    },
  },
};
