import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 100;

export default {
  type: "app",
  app: "lightspeed_retail_pos",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account",
      description: "Identifier of your account",
      async options() {
        const { Account: account } = await this.getAccount();
        return [
          {
            value: account.accountID,
            label: account.name,
          },
        ];
      },
    },
    customerTypeId: {
      type: "string",
      label: "Customer Type",
      description: "Identifier of a customer type",
      optional: true,
      async options({
        accountId, prevContext,
      }) {
        return await this.getPropOptions({
          accountId,
          resourceFn: this.listCustomerTypes,
          resourceKey: "CustomerType",
          valueKey: "customerTypeID",
          labelKey: "name",
          next: prevContext?.next,
        });
      },
    },
    itemId: {
      type: "string",
      label: "Item",
      description: "Identifier of an inventory item",
      async options({
        accountId, prevContext,
      }) {
        return await this.getPropOptions({
          accountId,
          resourceFn: this.listItems,
          resourceKey: "Item",
          valueKey: "itemID",
          labelKey: "description",
          next: prevContext?.next,
        });
      },
    },
    shopId: {
      type: "string",
      label: "Shop",
      description: "Identifier of a shop",
      async options({
        accountId, prevContext,
      }) {
        return await this.getPropOptions({
          accountId,
          resourceFn: this.listShops,
          resourceKey: "Shop",
          valueKey: "shopID",
          labelKey: "name",
          next: prevContext?.next,
        });
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.lightspeedapp.com/API/V3";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    async getPropOptions({
      accountId, resourceFn, resourceKey, valueKey, labelKey, next,
    }) {
      const args = {
        accountId,
      };
      if (next) {
        args.url = next;
      }
      const response = await resourceFn(args);
      const attributes = response["@attributes"];
      const items = !response[resourceKey]
        ? []
        : Array.isArray(response[resourceKey])
          ? response[resourceKey]
          : [
            response[resourceKey],
          ];
      const options = items?.map((item) => ({
        value: item[valueKey],
        label: item[labelKey],
      })) || [];
      return {
        options,
        context: {
          next: attributes?.next,
        },
      };
    },
    getAccount(args = {}) {
      return this._makeRequest({
        path: "/Account.json",
        ...args,
      });
    },
    getItem({
      accountId, itemId, ...args
    }) {
      return this._makeRequest({
        path: `/Account/${accountId}/Item/${itemId}.json`,
        ...args,
      });
    },
    getInventoryLog({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/Account/${accountId}/InventoryLog.json`,
        ...args,
      });
    },
    listCustomerTypes({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/Account/${accountId}/CustomerType.json`,
        ...args,
      });
    },
    listItems({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/Account/${accountId}/Item.json`,
        ...args,
      });
    },
    listShops({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/Account/${accountId}/Shop.json`,
        ...args,
      });
    },
    listSales({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/Account/${accountId}/Sale.json`,
        ...args,
      });
    },
    createCustomer({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/Account/${accountId}/Customer.json`,
        method: "POST",
        ...args,
      });
    },
    createEmployee({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/Account/${accountId}/Employee.json`,
        method: "POST",
        ...args,
      });
    },
    updateItem({
      accountId, itemId, ...args
    }) {
      return this._makeRequest({
        path: `/Account/${accountId}/Item/${itemId}.json`,
        method: "PUT",
        ...args,
      });
    },
    async *paginate({
      resourceFn,
      args,
      resourceKey,
      limit,
    }) {
      args = {
        ...args,
        params: {
          ...args.params,
          limit: DEFAULT_LIMIT,
        },
      };
      let total = 0;
      let count = 0;
      do {
        const response = await resourceFn(args);
        const attributes = response["@attributes"];
        if (!response[resourceKey]) {
          return;
        }
        const items = Array.isArray(response[resourceKey])
          ? response[resourceKey]
          : [
            response[resourceKey],
          ];
        for (const item of items) {
          yield item;
          count++;
          if (limit && count >= limit) {
            return;
          }
        }
        args.url = attributes?.next;
        total = items?.length;
      } while (total === args.params.limit);
    },
  },
};
