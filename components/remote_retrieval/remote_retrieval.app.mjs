import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "remote_retrieval",
  propDefinitions: {
    oid: {
      type: "string",
      label: "Order ID",
      description: "The ID of the order to retrieve.",
      async options({ page }) {
        const orders = await this.getDeviceReturnOrders({
          params: {
            page: page + 1,
          },
        });
        if (orders.message === "Data not found!") {
          return [];
        }
        return orders?.map(({
          order_id: value, shipments,
        }) => ({
          value,
          label: `Order ID: ${value} - ${shipments.device_type}`,
        })) || [];
      },
    },
  },
  methods: {
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
    getOrder({
      oid, ...args
    } = {}) {
      return this.makeRequest({
        path: `/device_returns?oid=${oid}/`,
        ...args,
      });
    },
    getDeviceReturnOrders(args = {}) {
      return this.makeRequest({
        path: "/device_returns",
        ...args,
      });
    },
    getPendingOrders(args = {}) {
      return this.makeRequest({
        path: "/pending-orders/",
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
        const response =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              page,
              ...resourceFnArgs?.params,
            },
          });

        if (!response || response.message === "Data not found!") {
          console.log("No more resources found");
          return;
        }

        for (const resource of response) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            return;
          }
        }

        page++;
      }
    },
  },
};
