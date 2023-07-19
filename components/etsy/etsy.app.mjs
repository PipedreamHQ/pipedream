import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "etsy",
  propDefinitions: {
    shopId: {
      type: "string",
      label: "Shop ID",
      description: "The ID of the shop to query",
      async options({ query }) {
        const { results } = await this.findShops({
          params: {
            shop_name: query ?? "",
          }
        });
        return results?.map(({
          shop_id: value, shop_name: label
        }) => ({
          label,
          value,
        }));
      }
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
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "x-api-key": this.$auth.oauth_client_id,
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
    patch(args = {}) {
      return this.makeRequest({
        method: "patch",
        ...args,
      });
    },
    getMe(args = {}) {
      return this.makeRequest({
        path: "/application/users/me",
        ...args,
      });
    },
    getShopReceiptTransactionsByShop({
      shopId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/application/shops/${shopId}/transactions`,
        ...args,
      });
    },
    getShopReceipts({
      shopId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/application/shops/${shopId}/receipts`,
        ...args,
      });
    },
    getListingsByShop({
      shopId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/application/shops/${shopId}/listings`,
        ...args,
      });
    },
    findShops(args = {}) {
      return this.makeRequest({
        path: "/application/shops",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let offset = 0;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs.params,
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

        offset += nextResources.length;
      }
    },
  },
};
