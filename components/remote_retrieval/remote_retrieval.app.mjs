import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "remote_retrieval",
  propDefinitions: {
    oid: {
      type: "string",
      label: "Order ID",
      description: "The ID of the order to retrieve.",
      async options({ prevContext }) {
        const { page } = prevContext;
        if (page === null) {
          return [];
        }

        const {
          next,
          results: orders,
        } = await this.pendingOrders({
          params: {
            page,
          },
        });

        const options = orders.map(({
          id: value, employee_info: { name: label },
        }) => ({
          label,
          value,
        }));

        return {
          options,
          context: {
            page: utils.getParamFromUrl(next),
          },
        };
      },
    },
  },
  methods: {

    authKeys() {
      console.log(Object.keys(this.$auth));
    },

    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
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
    pendingOrders(args = {}) {
      return this.makeRequest({
        path: "/pending-orders/",
        ...args,
      });
    },

    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let page;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              page,
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

        if (!response.next) {
          console.log("No next page found");
          return;
        }

        page = utils.getParamFromUrl(response.next);
      }
    },

  },
};
