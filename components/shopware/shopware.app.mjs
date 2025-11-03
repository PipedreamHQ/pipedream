import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "shopware",
  propDefinitions: {
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The ID of the order to get",
      async options({
        page, field = "id",
      }) {
        const { data } = await this.listOrders({
          params: {
            limit: LIMIT,
            offset: (page - 1) * LIMIT,
          },
        });

        return data.map((item) => ({
          label: `Order #${item.orderNumber}`,
          value: item[field],
        }));
      },
    },
    tagIds: {
      type: "string[]",
      label: "Tag IDs",
      description: "The IDs of the tags to get",
      async options({ page }) {
        const { data } = await this.listTags({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    ruleIds: {
      type: "string[]",
      label: "Rule IDs",
      description: "The IDs of the rules to get",
      async options({ page }) {
        const { data } = await this.listRules({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    currencyId: {
      type: "string",
      label: "Currency ID",
      description: "The ID of the currency to use for the order",
      async options({ page }) {
        const { data } = await this.listCurrencies({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    salesChannelId: {
      type: "string",
      label: "Sales Channel ID",
      description: "The ID of the sales channel to use for the order",
      async options({ page }) {
        const { data } = await this.listSalesChannels({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    stateId: {
      type: "string",
      label: "State ID",
      description: "The ID of the state to use for the order",
      async options({ type }) {
        const { data } = await this.listStates();
        const stateId = data.find(({ technicalName }) => technicalName === type)?.id;
        const { data: machineStates } = await this.listMachineStates();
        const machineStateIds = machineStates
          .filter(({ stateMachineId }) => stateMachineId === stateId);
        return machineStateIds.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    customerAddressId: {
      type: "string",
      label: "Customer Address ID",
      description: "The ID of the customer address to use for the order",
      async options({ page }) {
        const { data } = await this.listCustomerAddresses({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          firstName, lastName, street, city, zipcode, id: value,
        }) => ({
          label: `${firstName} ${lastName} - ${street} ${city} ${zipcode}`,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return `${this.$auth.server_url}/api`;
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    listOrders(args = {}) {
      return this._makeRequest({
        path: "order",
        ...args,
      });
    },
    listTags(args = {}) {
      return this._makeRequest({
        path: "tag",
        ...args,
      });
    },
    listRules(args = {}) {
      return this._makeRequest({
        path: "rule",
        ...args,
      });
    },
    listCurrencies(args = {}) {
      return this._makeRequest({
        path: "currency",
        ...args,
      });
    },
    listCustomerAddresses(args = {}) {
      return this._makeRequest({
        path: "customer-address",
        ...args,
      });
    },
    listSalesChannels(args = {}) {
      return this._makeRequest({
        path: "sales-channel",
        ...args,
      });
    },
    listStates(args = {}) {
      return this._makeRequest({
        path: "state-machine",
        ...args,
      });
    },
    listMachineStates(args = {}) {
      return this._makeRequest({
        path: "state-machine-state",
        ...args,
      });
    },
    getOrder({
      orderId, ...args
    } = {}) {
      return this._makeRequest({
        path: `order/${orderId}`,
        ...args,
      });
    },
    createOrder(args = {}) {
      return this._makeRequest({
        path: "order",
        method: "POST",
        ...args,
      });
    },
    listPaymentMethods(args = {}) {
      return this._makeRequest({
        path: "payment-method",
        ...args,
      });
    },
    listShippingMethods(args = {}) {
      return this._makeRequest({
        path: "shipping-method",
        ...args,
      });
    },
    updateOrder({
      orderId, ...args
    }) {
      return this._makeRequest({
        path: `order/${orderId}`,
        method: "PATCH",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        params.limit = LIMIT;
        const { data } = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
