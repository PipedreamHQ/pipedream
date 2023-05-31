import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import method from "./common/method.mjs";

export default {
  type: "app",
  app: "baselinker",
  propDefinitions: {
    inventoryId: {
      type: "string",
      label: "Inventory ID",
      description: "The ID of the inventory.",
      async options() {
        const response = await this.listInventories();
        return response?.inventories?.map(({
          inventory_id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The ID of the product.",
      async options({
        inventoryId, page,
      }) {
        const response = await this.listInventoryProducts({
          data: {
            parameters: {
              page,
              inventory_id: inventoryId,
            },
          },
        });
        return Object.entries(response.products)
          .map(([
            , {
              id: value, name: label,
            },
          ]) => ({
            label,
            value,
          }));
      },
    },
    orderStatusId: {
      type: "string",
      label: "Order Status ID",
      description: "The ID of the order status.",
      async options() {
        const response = await this.listOrderStatuses();
        return response?.statuses?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The ID of the order.",
      async options() {
        const response = await this.listOrders();
        return response?.orders?.map(({ order_id: value }) => String(value));
      },
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "3-letter currency symbol (e.g. `EUR`, `PLN`)",
    },
  },
  methods: {
    getUrl(path, url) {
      return url || `${constants.BASE_URL}${path}`;
    },
    getHeaders(headers) {
      return {
        "X-BLToken": this.$auth.api_key,
        ...headers,
      };
    },
    getData({
      method, parameters,
    } = {}) {
      if (!method) {
        throw new Error("method property is required in data request");
      }
      const init = parameters
        ? {
          method,
          parameters: JSON.stringify(parameters),
        }
        : {
          method,
        };

      const params = new URLSearchParams(init);
      return params.toString();
    },
    async makeRequest({
      step = this, path, headers, url, data, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        data: this.getData(data),
        ...args,
      };

      const response = await axios(step, config);

      if (response.status !== "SUCCESS") {
        throw new Error(JSON.stringify(response, null, 2));
      }

      return response;
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    connector(args = {}) {
      return this.post({
        path: "/connector.php",
        ...args,
      });
    },
    listInventories(args = {}) {
      return this.connector({
        ...args,
        data: {
          method: method.GET_INVENTORIES,
          ...args.data,
        },
      });
    },
    listInventoryProducts(args = {}) {
      return this.connector({
        ...args,
        data: {
          method: method.GET_INVENTORY_PRODUCTS_LIST,
          ...args.data,
        },
      });
    },
    listOrderStatuses(args = {}) {
      return this.connector({
        ...args,
        data: {
          method: method.GET_ORDER_STATUS_LIST,
          ...args.data,
        },
      });
    },
    listOrders(args = {}) {
      return this.connector({
        ...args,
        data: {
          method: method.GET_ORDERS,
          ...args.data,
        },
      });
    },
    listJournal(args = {}) {
      return this.connector({
        ...args,
        data: {
          method: method.GET_JOURNAL_LIST,
          ...args.data,
        },
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName,
    }) {
      const response = await resourceFn(resourceFnArgs);

      const nextResources = resourceName && response[resourceName] || response;

      if (!nextResources?.length) {
        console.log("No more resources found");
        return;
      }

      for (const resource of nextResources) {
        yield resource;
      }
    },
  },
};
